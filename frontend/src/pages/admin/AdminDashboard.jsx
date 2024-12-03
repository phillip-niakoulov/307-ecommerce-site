import UserList from '../../components/UserList.jsx';
import ProductCreate from './ProductCreate.jsx';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterAdmin from './RegisterAdmin.jsx';
import { UserContext } from '../../other/UserContext.jsx';

const AdminDashboard = () => {
    // Kicks you if you're not logged in and only shows you the menus you have access to
    const navigate = useNavigate();
    const { loggedIn, permissions } = useContext(UserContext);
    const [viewUsers, setViewUsers] = useState(false);
    const [createProduct, setCreateProduct] = useState(false);
    const [registerAdmin, setRegisterAdmin] = useState(false);
    const [option, setOption] = useState(null);

    useEffect(() => {
        if (!loggedIn || !permissions) {
            navigate('/login');
        }
        setViewUsers(permissions['get-users']);
        setCreateProduct(permissions['create-product']);
        setRegisterAdmin(permissions['register-admin']);
    }, [
        loggedIn,
        permissions,
        navigate,
        setViewUsers,
        setRegisterAdmin,
        setCreateProduct,
        option,
        viewUsers,
        createProduct,
        registerAdmin,
    ]);

    function getView(op) {
        if (op === 'permissions') {
            return <UserList />;
        }
        if (op === 'product') {
            return <ProductCreate />;
        }
        if (op === 'admin') {
            return <RegisterAdmin />;
        }
        return null;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {viewUsers ? (
                <button onClick={() => setOption('permissions')}>
                    Manage Permissions
                </button>
            ) : (
                ''
            )}
            {viewUsers ? (
                <button onClick={() => setOption('product')}>
                    Create Product
                </button>
            ) : (
                ''
            )}
            {viewUsers ? (
                <button onClick={() => setOption('admin')}>
                    Register Admin
                </button>
            ) : (
                ''
            )}
            {getView(option)}
        </div>
    );
};

export default AdminDashboard;
