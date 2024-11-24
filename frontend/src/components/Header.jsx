import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../other/UserContext.jsx';

const Header = () => {
    const { loggedIn, setLoggedIn, permissions, userId } =
        useContext(UserContext);
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
                {loggedIn &&
                permissions !== null &&
                (permissions['create-product'] ||
                    permissions['get-users'] ||
                    permissions['register-admin']) ? (
                    <Link to="/admin">Admin Dashboard</Link>
                ) : (
                    ''
                )}

                {loggedIn && <a href={`/user/${userId}`}>Profile</a>}

                {loggedIn ? (
                    <a
                        id={'logout'}
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() =>
                            new Promise(() => {
                                localStorage.clear();
                                document.getElementById('logout').hidden = true;
                                setLoggedIn(false);
                            })
                        }
                    >
                        Logout
                    </a>
                ) : (
                    ''
                )}
            </nav>
        </header>
    );
};

export default Header;
