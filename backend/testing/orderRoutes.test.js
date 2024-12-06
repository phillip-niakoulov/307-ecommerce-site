const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createMockAuthenticateJWT = () => {
    return jest.fn((req, res, next) => {
        // Simulate authentication with flexible user object
        req.user = {
            userId: 'userId123',
            username: 'testuser',
            permissions: {}
        };
        next();
    });
};

const createMockAuthenticatePermissions = () => {
    return jest.fn(() => (req, res, next) => {
        // Add permission logic if needed
        next();
    });
};

const createMockOrderModel = () => {
    const mockFind = jest.fn();

    mockFind.mockImplementation(() => ({
        sort: jest.fn().mockImplementation(() => {
            // Return the mocked orders
            return Promise.resolve([
                { _id: 'order1', owner: 'userId123', username: 'testuser', cart: [] }
            ]);
        })
    }));

    return {
        find: mockFind,
        findById: jest.fn(),
        create: jest.fn()
    };
};

// Mock the modules consistently
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
        // Clear all mocks before each test
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

        // Mock JWT and mongoose methods
        jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');
        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true);

        // Reset Order model mock behaviors
        Order.find.mockClear();
    });

    describe('GET /orders', () => {
        it('should fetch all orders successfully', async () => {
            const res = await request(app)
                .get('/orders')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                { _id: 'order1', owner: 'userId123', username: 'testuser', cart: [] }
            ]);
            expect(Order.find).toHaveBeenCalledWith({});
        });

        it('should return 500 if an error occurred', async () => {
            // Simulate a find method that throws an error
            Order.find.mockImplementationOnce(() => ({
                sort: jest.fn().mockRejectedValue(new Error('Database Error'))
            }));

            const res = await request(app)
                .get('/orders')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Database Error' });
        });
    });

    describe('GET /orders/user/:id', () => {
        it('should fetch orders for the specified user ID', async () => {
            const res = await request(app)
                .get('/orders/user/userId123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                { _id: 'order1', owner: 'userId123', username: 'testuser', cart: [] }
            ]);
            expect(Order.find).toHaveBeenCalledWith({ owner: 'userId123' });
        });

        it('should return 500 if an error occurs', async () => {
            // Simulate a find method that throws an error
            Order.find.mockImplementationOnce(() => ({
                sort: jest.fn().mockRejectedValue(new Error('Database error'))
            }));

            const res = await request(app)
                .get('/orders/user/userId123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Database error' });
        });
    });
    describe('GET /orders/:id', () => {
        let mockToken;

        beforeEach(() => {
            // Clear all mocks and reset mock implementations
            jest.clearAllMocks();

            // Create a mock token for authentication
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
            // Mock the findById method to return a sample order
            const mockOrder = {
                _id: 'order123',
                owner: 'userId123',
                username: 'testuser',
                cart: [{ productId: 'product1', quantity: 2 }]
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
            // Mock findById to return null (order not found)
            Order.findById.mockResolvedValue(null);

            const res = await request(app)
                .get('/orders/nonexistentorder')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ 'Order not found with this id': 'nonexistentorder' });
            expect(Order.findById).toHaveBeenCalledWith('nonexistentorder');
        });

        it('should return 500 when a database error occurs', async () => {
            // Mock findById to throw an error
            Order.findById.mockRejectedValue(new Error('Database connection error'));

            const res = await request(app)
                .get('/orders/order123')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Database connection error' });
            expect(Order.findById).toHaveBeenCalledWith('order123');
        });

        // Optional: Add a test to check authentication middleware
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/orders/order123');

            expect(res.status).toBe(401); // Assuming your auth middleware returns 401 for missing token
        });
    });

});