import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const ProfileButton = () => {
    const { userId, loggedIn, userData } = useContext(UserContext);
    if (!loggedIn) {
        return '';
    }
    let name = '';
    if (!userData) return '';
    if (userData['firstName']) {
        name = userData['firstName'];
    } else {
        name = userData['username'];
    }
    return <NavLink to={`/user/${userId}`}>Hello, {name}</NavLink>;
};

export default ProfileButton;
