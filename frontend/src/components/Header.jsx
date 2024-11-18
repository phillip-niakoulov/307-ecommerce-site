import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <header>
            <h1>E-Shop <span>Pro</span></h1>
            <nav>
                <Link to="/">Home </Link>
                <Link to="/login">Login </Link>
                <Link to="/register">Register </Link>
            </nav>
            {location.pathname === '/login' && <h2>Login Page</h2>}
            {location.pathname === '/register' && <h2>Register Page</h2>}
        </header>
    );
};

export default Header;
