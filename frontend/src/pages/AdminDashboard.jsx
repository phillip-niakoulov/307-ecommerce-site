import { useContext, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import UserList from '../components/UserList';
import ProductCreate from './ProductCreate.jsx';
import RegisterAdmin from './RegisterAdmin.jsx';
import { UserContext } from '../other/UserContext.jsx';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { loggedIn, permissions } = useContext(UserContext);

    useEffect(() => {
        if (!loggedIn || !permissions) {
            navigate('/login');
        }
    }, [loggedIn, permissions, navigate]);

    return (
        <div className="admin-dashboard">
            {permissions &&
            (permissions['get-users'] ||
                permissions['create-product'] ||
                permissions['register-admin']) ? (
                <>
                    <nav className="subtabs">
                        {permissions['get-users'] && (
                            <NavLink to="users" activeClassName="active">
                                User Management
                            </NavLink>
                        )}
                        {permissions['create-product'] && (
                            <NavLink to="products" activeClassName="active">
                                Product Creation
                            </NavLink>
                        )}
                        {permissions['register-admin'] && (
                            <NavLink
                                to="register-admin"
                                activeClassName="active"
                            >
                                Admin Registration
                            </NavLink>
                        )}
                    </nav>

                    <Routes>
                        {permissions['get-users'] && (
                            <Route path="users" element={<UserList />} />
                        )}
                        {permissions['create-product'] && (
                            <Route
                                path="products"
                                element={<ProductCreate />}
                            />
                        )}
                        {permissions['register-admin'] && (
                            <Route
                                path="register-admin"
                                element={<RegisterAdmin />}
                            />
                        )}
                        <Route
                            path="*"
                            element={
                                <p className="info">Select an option above.</p>
                            }
                        />
                    </Routes>
                </>
            ) : (
                <p className="info">Nothing to see here...</p>
            )}
        </div>
    );
};

export default AdminDashboard;
