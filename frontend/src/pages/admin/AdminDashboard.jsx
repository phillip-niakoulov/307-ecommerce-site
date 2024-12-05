import { useContext, useEffect } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import OrdersButton from '../../components/HeaderButtons/OrdersButton.jsx';
import UserList from '../../components/UserList.jsx';
import ProductCreate from '../products/ProductCreate.jsx';
import RegisterAdmin from './RegisterAdmin.jsx';
import { UserContext } from '../../other/UserContext.jsx';
import OrderListAdmin from '../../pages/orders/OrderListAdmin.jsx';
import '../../styles/pages/AdminDashboard.css';

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
                        {<OrdersButton />}
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
                        {permissions['view-orders'] && (
                            <Route path="orders" element={<OrderListAdmin />} />
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
