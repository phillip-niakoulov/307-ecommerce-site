const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createMockAuthenticateJWT = () => {
    return jest.fn((req, res, next) => {
        req.user = {
            userId: 'userId123',
            username: 'testuser',
            permissions: {},
        };
        next();
    });
};

const createMockAuthenticatePermissions = () => {
    return jest.fn(() => (req, res, next) => {
        next();
    });
};

const createMockOrderModel = () => {
    const mockFind = jest.fn();

    mockFind.mockImplementation(() => ({
        sort: jest.fn().mockImplementation(() => {
            return Promise.resolve([
                {
                    _id: 'order1',
                    owner: 'userId123',
                    username: 'testuser',
                    cart: [],
                },
            ]);
        }),
    }));

    return {
        find: mockFind,
        findById: jest.fn(),
        create: jest.fn(),
    };
};

jest.mock('../authMiddleware', () => createMockAuthenticateJWT());
jest.mock('../permissionMiddleware', () => createMockAuthenticatePermissions());
jest.mock('../models/Order', () => createMockOrderModel());

const router = require('../routes/orderRoutes.js');
const Order = require('../models/Order');

const app = express();
app.use(express.json());
app.use('/orders', router);

describe('Order Routes', () => {
    let mockToken;
    beforeEach(() => {
        jest.clearAllMocks();

        mockToken = jwt.sign(
            {
                userId: 'userId123',
                username: 'testuser',
                permissions: {},
            },
            process.env.JWT_KEY || 'mock-secret',
            { expiresIn: '1h' }
        );

        jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');
        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

        Order.find.mockClear();
    });

    describe('GET /orders', () => {
        it('should fetch all orders successfully', async () => {
            const res = await request(app)
                .get('/orders')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {
                    _id: 'order1',
                    owner: 'userId123',
                    username: 'testuser',
                    cart: [],
                },
            ]);
            expect(Order.find).toHaveBeenCalledWith({});
        });
    });

    describe('GET /orders/user/:id', () => {
        it('should fetch orders for the specified user ID', async () => {
            const res = await request(app)
                .get('/orders/user/userId123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {
                    _id: 'order1',
                    owner: 'userId123',
                    username: 'testuser',
                    cart: [],
                },
            ]);
            expect(Order.find).toHaveBeenCalledWith({ owner: 'userId123' });
        });
    });
    describe('GET /orders/:id', () => {
        let mockToken;

        beforeEach(() => {
            jest.clearAllMocks();

            mockToken = jwt.sign(
                {
                    userId: 'userId123',
                    username: 'testuser',
                    permissions: {},
                },
                process.env.JWT_KEY || 'mock-secret',
                { expiresIn: '1h' }
            );
        });

        it('should successfully retrieve an order by ID', async () => {
            const mockOrder = {
                _id: 'order123',
                owner: 'userId123',
                username: 'testuser',
                cart: [{ productId: 'product1', quantity: 2 }],
            };
            Order.findById.mockResolvedValue(mockOrder);

            const res = await request(app)
                .get('/orders/order123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrder);
            expect(Order.findById).toHaveBeenCalledWith('order123');
        });

        it('should return 404 when order is not found', async () => {
            Order.findById.mockResolvedValue(null);

            const res = await request(app)
                .get('/orders/nonexistentorder')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                'Order not found with this id': 'nonexistentorder',
            });
            expect(Order.findById).toHaveBeenCalledWith('nonexistentorder');
        });
    });
});
