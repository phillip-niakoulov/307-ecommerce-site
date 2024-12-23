import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { setLoggedIn, setPermissions } = useContext(UserContext);
    return (
        <button
            id={'logoutButton'}
            className="profile-button"
            style={{
                cursor: 'pointer',
            }}
            onClick={() =>
                new Promise(() => {
                    localStorage.clear();
                    document.getElementById('logoutButton').hidden = true;
                    setLoggedIn(false);
                    setPermissions({});
                    navigate('/');
                })
            }
        >
            Logout
        </button>
    );
};
export default LogoutButton;
