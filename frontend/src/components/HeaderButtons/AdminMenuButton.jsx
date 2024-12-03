import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const AdminMenuButton = () => {
    const { loggedIn, permissions } = useContext(UserContext);
    if (
        loggedIn &&
        permissions !== null &&
        (permissions['create-product'] ||
            permissions['get-users'] ||
            permissions['register-admin'])
    ) {
        return <Link to="/admin">Admin Dashboard</Link>;
    }
    return null;
};

export default AdminMenuButton;
