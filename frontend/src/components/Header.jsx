import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <h1>E-SHOP (Pro)</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/cart">Cart</Link>
                {/* TEMP */}
                <Link to="/registeradmin">Register Admin</Link>
                <Link to="/admin">Admin Dashboard</Link>
                <Link to="/qwertyuiop">404 Page</Link>
            </nav>
        </header>
    );
};

export default Header;
