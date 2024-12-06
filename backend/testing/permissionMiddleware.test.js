const permissionMiddleware = require('../permissionMiddleware');
const User = require('../models/User');

jest.mock('../models/User');
jest.mock('mongoose', () => ({
    ...jest.requireActual('mongoose'),
    isValidObjectId: jest.fn(),
}));

describe('Permission Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { id: 'mockUserId' };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    const testCases = [
        {
            description: 'should return 403 if no user ID is logged',
            setupMocks: () => {
                req.id = null;
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Access denied. No user id logged.',
                });
                expect(next).not.toHaveBeenCalled();
            },
        },
        {
            description: 'should return 403 if the user is not found',
            setupMocks: () => {
                User.findOne.mockImplementation(null);
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.json).toHaveBeenCalledWith({
                    message: "Can't find user.",
                });
                expect(next).not.toHaveBeenCalled();
            },
        },
        {
            description:
                'should return 403 if the user lacks the required permission',
            setupMocks: () => {
                User.findById.mockResolvedValue({
                    permissions: { somePermission: false },
                });
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.json).toHaveBeenCalledWith({
                    message:
                        'Access denied. You do not have the required permission.',
                });
                expect(next).not.toHaveBeenCalled();
            },
        },
        {
            description:
                'should call next() if the user has the required permission',
            setupMocks: () => {
                User.findById.mockResolvedValue({
                    permissions: { 'view-users': true },
                });
            },
            requiredPermission: 'view-users',
            expect: () => {
                expect(next).toHaveBeenCalled();
                expect(res.status).not.toHaveBeenCalled();
            },
        },
    ];

    testCases.forEach(
        ({ description, setupMocks, requiredPermission, expect }) => {
            it(description, async () => {
                if (setupMocks) setupMocks();

                const middleware = permissionMiddleware(requiredPermission);

                await middleware(req, res, next);

                expect();
            });
        }
    );
});
