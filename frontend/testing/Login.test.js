import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../src/other/UserContext.jsx';
import React from 'react';
import Login from '../src/pages/auth/Login.jsx';

global.import = {
    meta: {
        env: {
            VITE_API_BACKEND_URL: 'http://localhost:5000',
        },
    },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

global.fetch = jest.fn();

describe('Login Component', () => {
    let mockNavigate;
    let mockContextValues;

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                clear: jest.fn(),
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });
        mockNavigate = jest.fn();
        jest.requireMock('react-router-dom').useNavigate.mockReturnValue(
            mockNavigate
        );

        mockContextValues = {
            loggedIn: false,
            setLoggedIn: jest.fn(),
            setUserId: jest.fn(),
            setPermissions: jest.fn(),
        };

        fetch.mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({ token: 'mockToken' }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <Router>
                <UserContext.Provider value={mockContextValues}>
                    <Login />
                </UserContext.Provider>
            </Router>
        );

    test('should navigate to "/" if user is already logged in', () => {
        mockContextValues.loggedIn = true;

        renderComponent();

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('should display login form', () => {
        renderComponent();

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /submit/i })
        ).toBeInTheDocument();
    });

    test('should submit login on button click', async () => {
        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(submitButton);

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.VITE_API_BACKEND_URL}/api/users/login`,
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    username: 'testUser',
                    password: 'testPassword',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        await screen.findByText(/mockToken/); // Ensures async fetch completes
    });

    test('should handle Enter key press in input fields', () => {
        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);

        fireEvent.keyPress(usernameInput, {
            key: 'Enter',
            code: 'Enter',
            charCode: 13,
        });

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should show error message on login failure', async () => {
        fetch.mockResolvedValueOnce({
            status: 401,
            json: jest
                .fn()
                .mockResolvedValue({ message: 'Invalid credentials' }),
        });

        renderComponent();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
        fireEvent.click(submitButton);

        const errorMessage = await screen.findByText(/invalid credentials/i);

        expect(errorMessage).toBeInTheDocument();
    });

    test('should clear context and local storage on fetch error', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        renderComponent();

        const submitButton = screen.getByRole('button', { name: /submit/i });

        fireEvent.click(submitButton);

        expect(mockContextValues.setLoggedIn).toHaveBeenCalledWith(false);
        expect(mockContextValues.setUserId).toHaveBeenCalledWith('');
        expect(mockContextValues.setPermissions).toHaveBeenCalledWith({});
        expect(localStorage.clear).toHaveBeenCalled();
    });
});
