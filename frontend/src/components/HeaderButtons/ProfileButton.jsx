import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const ProfileButton = () => {
    const { userId, loggedIn, userData } = useContext(UserContext);
    if (!loggedIn || !userData) {
        return null;
    }
    return <NavLink to={`/user/${userId}`}>Hello, {userData['username']}</NavLink>;
};

export default ProfileButton;
