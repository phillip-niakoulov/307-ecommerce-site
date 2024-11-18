import UserList from '../components/UserList';
import ProductCreate from './ProductCreate.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // Kicks you if you're not logged in and only shows you the menus you have access to
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const perms = JSON.parse(localStorage.getItem('permissions'));
        if (!perms) {
            navigate('/login');
            return;
        }
        setPermissions(perms);
    }, [navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {permissions['get-users'] === true && <UserList />}
            {permissions['create-product'] === true && <ProductCreate />}
            {permissions['get-users'] == false &&
                permissions['create-product'] == false && (
                    <p>Nothing to see here...</p>
                )}
        </div>
    );
};

export default AdminDashboard;
