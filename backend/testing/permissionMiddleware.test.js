const permissionMiddleware = require('../permissionMiddleware');
const User = require('../models/User');

jest.mock('../models/User');

describe('Permission Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = { id: 'mockUserId' };
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
            description: 'should return 403 if no user ID is logged',
            setupMocks: () => {
                mockReq.id = null;
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: 'Access denied. No user id logged.',
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description: 'should return 403 if the user is not found',
            setupMocks: () => {
                User.findById.mockResolvedValue(null);
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Can't find user.",
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description:
                'should return 403 if the user lacks the required permission',
            setupMocks: () => {
                User.findById.mockResolvedValue({
                    _id: 'mockUserId',
                    permissions: { 'edit-users': true },
                    select: jest.fn().mockReturnThis(),
                });
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message:
                        'Access denied. You do not have the required permission.',
                });
                expect(mockNext).not.toHaveBeenCalled();
            },
        },
        {
            description:
                'should call next() if the user has the required permission',
            setupMocks: () => {
                User.findById.mockResolvedValue({
                    _id: 'mockUserId',
                    permissions: { 'view-users': true },
                    select: jest.fn().mockReturnThis(),
                });
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(mockNext).toHaveBeenCalled();
                expect(mockRes.status).not.toHaveBeenCalled();
            },
        },
    ];

    testCases.forEach(
        ({ description, setupMocks, requiredPermission, expect }) => {
            it(description, async () => {
                if (setupMocks) setupMocks();

                const middleware = permissionMiddleware(requiredPermission);

                await middleware(mockReq, mockRes, mockNext);

                expect();
            });
        }
    );
});
