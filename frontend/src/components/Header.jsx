import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../other/UserContext.jsx';
import OrdersButton from './HeaderButtons/OrdersButton.jsx';
import AdminButton from './HeaderButtons/AdminButton.jsx';
import ProfileButton from './HeaderButtons/ProfileButton.jsx';
import '../styles/components/Header.css';

const Header = () => {
    const { loggedIn } = useContext(UserContext);
    return (
        <header>
            <h1 id="logo">
                E-Shop <span className="pro">PRO</span>
            </h1>
            <div id="nav-wrapper">
                <nav>
                    <Link to="/">Home</Link>
                    {loggedIn ? '' : <Link to="/login">Login</Link>}
                    {loggedIn ? '' : <Link to="/register">Register</Link>}
                    {loggedIn ? <Link to="/cart">Cart</Link> : ''}
                    {<AdminButton />}
                    {<OrdersButton />}

                    {<ProfileButton />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
