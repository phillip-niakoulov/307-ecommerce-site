const request = require('supertest');
const express = require('express');
const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/User');
const Order = require('../models/Order');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../models/Order');
jest.mock('mongoose', () => ({
    ...jest.requireActual('mongoose'),
    isValidObjectId: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

const mockAuthentication = ({
    permission = '',
    userId = 'userId',
    username = 'testuser',
} = {}) => {
    jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, {
            userId: userId,
            username: username,
            permissions: { [permission]: true },
        });
    });

    User.findById.mockImplementation(() => ({
        _id: userId,
        username: username,
        permissions: { [permission]: true },
        select: jest.fn().mockReturnThis(),
    }));
};

const mockDelete = () => {
    User.findByIdAndDelete.mockResolvedValue({
        _id: 'userId',
        username: 'testuser',
        permissions: {},
        select: jest.fn().mockReturnThis(),
    });
};

const mockUpdate = () => {
    User.findByIdAndUpdate.mockImplementation(() => ({
        _id: 'userId',
        username: 'testuser',
        permissions: {},
        select: jest.fn().mockReturnThis(),
    }));
};

describe('User Routes', () => {
    let mockToken;

    beforeEach(() => {
        mockToken = jwt.sign(
            {
                userId: 'userId',
                username: 'testuser',
                permissions: {},
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
        jwt.sign.mockReturnValue(mockToken);

        isValidObjectId.mockReturnValue(true);
    });

    afterEach(() => jest.clearAllMocks());

    const testCases = [
        {
            description: 'should fetch all users with valid permissions',
            route: '/users/',
            method: 'get',
            setupMocks: () => {
                mockAuthentication({ permission: 'get-users' });
                User.find.mockReturnValue({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValue([{}]),
                });
            },
            expect: (res) => {
                expect(res.body.message).toBe(undefined);
                expect(res.status).toBe(200);
            },
        },
        {
            description: 'should register a new user',
            route: '/users/register',
            method: 'post',
            payload: { username: 'testuser', password: 'password123' },
            setupMocks: () => {
                bcrypt.hash.mockResolvedValue('hashedPassword');
                User.prototype.save.mockResolvedValue({ _id: 'userId' });
            },
            expect: (res) => {
                expect(res.status).toBe(201);
                expect(res.body.message).toBe('User registered successfully');
            },
        },
        {
            description: 'should have an error with a duplicate user',
            route: '/users/register',
            method: 'post',
            payload: { username: 'testuser', password: 'password123' },
            setupMocks: () => {
                User.findOne.mockImplementation(() => ({
                    username: 'testuser',
                }));
            },
            expect: (res) => {
                expect(res.status).toBe(409);
                expect(res.body.message).toBe(
                    'Username or email is already in use'
                );
            },
        },
        {
            description: 'should register a new admin',
            route: '/users/register-admin',
            method: 'post',
            payload: { username: 'testadmin', password: 'password123' },
            setupMocks: () => {
                mockAuthentication({
                    userId: 'userId',
                    username: 'test',
                    permission: 'register-admin',
                });
                User.findOne.mockResolvedValue(null);
            },
            expect: (res) => {
                expect(res.body.message).toBe('User registered successfully');
                expect(res.status).toBe(201);
            },
        },
        {
            description: 'should login a user and return a token',
            route: '/users/login',
            method: 'post',
            payload: { username: 'testuser', password: 'password123' },
            setupMocks: () => {
                User.findOne.mockResolvedValue({
                    _id: 'userId',
                    username: 'testuser',
                    password: 'hashedPassword',
                });
                bcrypt.compare.mockResolvedValue(true);
            },
            expect: (res) => {
                expect(res.status).toBe(200);
                expect(res.body.token).toBe(mockToken);
            },
        },
        {
            description: 'should have an error with a missing username',
            route: '/users/login',
            method: 'post',
            payload: { username: 'testuser', password: 'password123' },
            setupMocks: () => {
                User.findOne.mockResolvedValue(undefined);
                bcrypt.compare.mockResolvedValue(true);
            },
            expect: (res) => {
                expect(res.status).toBe(403);
                expect(res.body.message).toBe('Invalid username');
            },
        },
        {
            description: 'should have an error with an invalid password',
            route: '/users/login',
            method: 'post',
            payload: { username: 'testuser', password: 'password123' },
            setupMocks: () => {
                User.findOne.mockResolvedValue({
                    _id: 'userId',
                    username: 'testuser',
                    password: 'hashedPassword',
                });
                bcrypt.compare.mockResolvedValue(false);
            },
            expect: (res) => {
                expect(res.status).toBe(403);
                expect(res.body.message).toBe('Invalid password');
            },
        },
        {
            description: 'should fetch user details for self',
            route: '/users/userId',
            method: 'get',
            setupMocks: () => {
                mockAuthentication();
            },
            expect: (res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty('username', 'testuser');
            },
        },
        {
            description: 'should have an error with invalid id',
            route: '/users/userId',
            method: 'get',
            setupMocks: () => {
                mockAuthentication();
                isValidObjectId.mockReturnValue(false);
            },
            expect: (res) => {
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('Bad ID');
            },
        },
        {
            description: 'should have an error with missing user',
            route: '/users/missingUser',
            method: 'get',
            setupMocks: () => {
                mockAuthentication({
                    permission: 'get-users',
                    username: 'missingUser',
                    userId: 'missingUser',
                });
                User.findById.mockResolvedValue(undefined);
            },
            expect: (res) => {
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('User not found');
            },
        },
        {
            description:
                'should return 403 if no permission to access other user',
            route: '/users/anotherUserId',
            method: 'get',
            setupMocks: () => {
                mockAuthentication();
            },
            expect: (res) => {
                expect(res.status).toBe(403);
                expect(res.body.message).toBe(
                    'Access denied. You do not have the required permission.'
                );
            },
        },
        {
            description: 'should update user details',
            route: '/users/userId',
            method: 'put',
            setupMocks: () => {
                mockAuthentication({ permission: 'manage-permissions' });
                mockUpdate();
            },
            expect: (res) => {
                expect(res.body).toHaveProperty('permissions');
                expect(res.status).toBe(200);
            },
        },
        {
            description: 'should have an error with id',
            route: '/users/userId',
            method: 'put',
            setupMocks: () => {
                mockAuthentication({ permission: 'manage-permissions' });
                isValidObjectId.mockReturnValue(false);
            },
            expect: (res) => {
                expect(res.body.message).toBe('Invalid ID format');
                expect(res.status).toBe(400);
            },
        },
        {
            description: 'should have an error with missing user',
            route: '/users/missingId',
            method: 'put',
            setupMocks: () => {
                mockAuthentication({ permission: 'manage-permissions' });
                User.findByIdAndUpdate.mockResolvedValue(undefined);
            },
            expect: (res) => {
                expect(res.body.message).toBe('User not found');
                expect(res.status).toBe(404);
            },
        },
        {
            description: 'should delete a user',
            route: '/users/userId',
            method: 'delete',
            setupMocks: () => {
                mockAuthentication({ permission: 'delete-users' });
                mockDelete();
            },
            expect: (res) => {
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('User deleted');
            },
        },
        {
            description: 'should delete a user but without permissions',
            route: '/users/testUser',
            method: 'delete',
            setupMocks: () => {
                mockAuthentication({
                    username: 'testUser',
                    permission: 'delete-users',
                });
                mockDelete();
            },
            expect: (res) => {
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('User deleted');
            },
        },
        {
            description: 'should have an error with id',
            route: '/users/userId',
            method: 'delete',
            setupMocks: () => {
                mockAuthentication({ permission: 'delete-users' });
                isValidObjectId.mockReturnValue(false);
            },
            expect: (res) => {
                expect(res.status).toBe(400);
                expect(res.body.message).toBe('Invalid ID format');
            },
        },
        {
            description: 'should have an error with missing user',
            route: '/users/userId',
            method: 'delete',
            setupMocks: () => {
                mockAuthentication({ permission: 'delete-users' });
                User.findByIdAndDelete.mockResolvedValue(undefined);
            },
            expect: (res) => {
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('User not found');
            },
        },
        {
            description: 'should create a checkout order',
            route: '/users/checkout',
            method: 'post',
            setupMocks: () => {
                mockAuthentication();

                const mockOrder = {
                    _id: 'orderId',
                    owner: 'userId',
                    cart: [{ productId: 'prod123', quantity: 2 }],
                };

                Order.prototype.save.mockResolvedValue(mockOrder);
            },
            expect: (res) => {
                expect(res.status).toBe(200);
                expect(res.body).toStrictEqual({
                    _id: 'orderId',
                    cart: [{ productId: 'prod123', quantity: 2 }],
                    owner: 'userId',
                });
            },
        },
    ];

    testCases.forEach(
        ({ description, route, method, payload, setupMocks, expect }) => {
            it(description, async () => {
                if (setupMocks) setupMocks();

                const req = request(app)
                    [method](route)
                    .set('Authorization', `Bearer ${mockToken}`);
                const res = payload ? await req.send(payload) : await req;

                expect(res);
            });
        }
    );
});
