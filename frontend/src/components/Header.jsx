import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../other/UserContext.jsx';
import OrdersButton from './HeaderButtons/OrdersButton.jsx';
import AdminButton from './HeaderButtons/AdminButton.jsx';
import ProfileButton from './HeaderButtons/ProfileButton.jsx';
import '../styles/components/Header.css';
import MyOrdersButton from './HeaderButtons/MyOrdersButton.jsx';

const Header = () => {
    const { loggedIn } = useContext(UserContext);
    return (
        <header>
            <Link className="logo-nav" to="/">
                <h1 className="logo">
                    E-Shop <span className="pro">PRO</span>
                </h1>
            </Link>
            <div className="nav-wrapper">
                <nav>
                    <NavLink to="/" end>
                        Home
                    </NavLink>
                    {loggedIn ? '' : <NavLink to="/login">Login</NavLink>}
                    {loggedIn ? '' : <NavLink to="/register">Register</NavLink>}
                    {loggedIn ? <NavLink to="/cart">Cart</NavLink> : ''}
                    {<AdminButton />}
                    {<MyOrdersButton />}
                    {<OrdersButton />}
                    {<ProfileButton />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
