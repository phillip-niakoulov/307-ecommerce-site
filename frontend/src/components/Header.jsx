import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../other/UserContext.jsx';
import OrdersButton from './HeaderButtons/OrdersButton.jsx';
import AdminButton from './HeaderButtons/AdminButton.jsx';
import ProfileButton from './HeaderButtons/ProfileButton.jsx';

const Header = () => {
    const { loggedIn } = useContext(UserContext);
    return (
        <header>
            <h1>
                E-Shop <span className="pro">Pro</span>
            </h1>
            <nav>
                <Link to="/">Home</Link>
                {loggedIn ? '' : <Link to="/login">Login</Link>}
                {loggedIn ? '' : <Link to="/register">Register</Link>}
                {loggedIn ? <Link to="/cart">Cart</Link> : ''}
                {<AdminButton />}
                {<OrdersButton />}

                {<ProfileButton />}
            </nav>
        </header>
    );
};

export default Header;
