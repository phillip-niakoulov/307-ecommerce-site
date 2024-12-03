import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const AdminButton = () => {
    const { loggedIn, permissions } = useContext(UserContext);
    if (
        loggedIn &&
        permissions !== null &&
        (permissions['create-product'] ||
            permissions['get-users'] ||
            permissions['register-admin'])
    ) {
        return <NavLink to="/admin">Admin Dashboard</NavLink>;
    }
    return '';
};

export default AdminButton;
