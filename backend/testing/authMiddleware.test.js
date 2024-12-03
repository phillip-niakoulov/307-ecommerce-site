const authenticateJWT = require('../authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

// Utility functions
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

// Tests
describe('JWT Authentication Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            header: jest.fn().mockReturnValue('Bearer mockToken'),
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    // Test cases
    const testCases = [
        {
            description: 'should return 403 if no token is provided',
            setupMocks: () => {
                mockReq.header.mockReturnValue(undefined);
            },
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: 'Access denied. No token provided.',
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description: 'should return 403 if the token is invalid',
            setupMocks: () => {
                jwt.verify.mockImplementation((token, secret, callback) => {
                    callback(new Error('Invalid token'), null);
                });
            },
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: 'Invalid token.',
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description: 'should return 401 if the token has expired',
            setupMocks: () => {
                jwt.verify.mockImplementation((token, secret, callback) => {
                    callback({ name: 'TokenExpiredError' }, null);
                });
            },
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: 'Token has expired. Please log in again.',
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description:
                'should call next() and set req.id if the token is valid',
            setupMocks: () => {
                jwt.verify.mockImplementation((token, secret, callback) => {
                    callback(null, { userId: 'mockUserId' });
                });
            },
            expect: () => {
                expect(mockReq.id).toBe('mockUserId');
                expect(mockNext).toHaveBeenCalled();
                expect(mockRes.status).not.toHaveBeenCalled();
            },
        },
    ];

    testCases.forEach(({ description, setupMocks, expect }) => {
        it(description, () => {
            if (setupMocks) setupMocks();

            // Call the middleware
            authenticateJWT(mockReq, mockRes, mockNext);

            // Assertions
            expect();
        });
    });
});
