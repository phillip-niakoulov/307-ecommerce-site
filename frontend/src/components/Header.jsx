import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <header>
            <h1>
                E-Shop <span className="pro">Pro</span>
            </h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/product/create">Create Product</Link>
                <Link to="/registeradmin">New Admin</Link>
                <Link to="/cart">Cart</Link>
            </nav>
            {location.pathname === '/login' && <h2>Login Page</h2>}
            {location.pathname === '/register' && <h2>Register Page</h2>}
            {location.pathname === '/reigsteradmin' && <h2>Register Admin</h2>}
            {location.pathname === '/product/create' && <h2>New Product</h2>}
            {location.pathname === '/cart' && <h2>Cart</h2>}
        </header>
    );
};

export default Header;
