import UserList from '../components/UserList';
import ProductCreate from './ProductCreate.jsx';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterAdmin from './RegisterAdmin.jsx';
import { UserContext } from '../other/UserContext.jsx';

const AdminDashboard = () => {
    // Kicks you if you're not logged in and only shows you the menus you have access to
    const navigate = useNavigate();
    const { loggedIn, permissions } = useContext(UserContext);

    useEffect(() => {
        if (!loggedIn || !permissions) {
            navigate('/login');
        }
    }, [loggedIn, permissions, navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {permissions['get-users'] === true && <UserList />}
            {permissions['create-product'] === true && <ProductCreate />}
            {permissions['register-admin'] === true && <RegisterAdmin />}
            {permissions['get-users'] === false &&
                permissions['create-product'] === false &&
                permissions['register-admin'] === false && (
                    <p>Nothing to see here...</p>
                )}
        </div>
    );
};

export default AdminDashboard;
