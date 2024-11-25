import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const LogoutButton = () => {
    const { setLoggedIn } = useContext(UserContext);
    return (
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
    );
};
export default LogoutButton;
