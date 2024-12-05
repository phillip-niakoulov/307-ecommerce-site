import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import Login from './src/pages/auth/Login.jsx';
import Register from './src/pages/auth/Register.jsx';
import ProductView from './src/pages/products/ProductView.jsx';
import Header from './src/components/Header.jsx';
import NotFound from './src/pages/NotFound.jsx';
import AdminDashboard from './src/pages/admin/AdminDashboard.jsx';
import ProductEdit from './src/pages/products/ProductEdit.jsx';
import ProfileView from './src/pages/ProfileView.jsx';
import Cart from './src/pages/Cart.jsx';
import { UserContext } from './src/other/UserContext.jsx';
import './src/styles/index.css';
import InitContext from './src/other/InitContext.jsx';
import OrderView from './src/pages/orders/OrderView.jsx';
import UserOrders from './src/pages/orders/UserOrders.jsx';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [permissions, setPermissions] = useState({});
    const [userData, setUserData] = useState({});

    const context = useMemo(() => {
        return {
            loggedIn,
            setLoggedIn,
            userId,
            setUserId,
            permissions,
            setPermissions,
            userData,
            setUserData,
        };
    }, [
        loggedIn,
        setLoggedIn,
        userId,
        permissions,
        setUserId,
        setPermissions,
        userData,
        setUserData,
    ]);

    return (
        <Router>
            <UserContext.Provider value={context}>
                <InitContext />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route
                        path="product/:productId"
                        element={<ProductView />}
                    />
                    <Route
                        path="product/:productId/edit"
                        element={<ProductEdit />}
                    />
                    <Route path={'cart'} element={<Cart />} />
                    <Route path="admin/*" element={<AdminDashboard />} />
                    <Route path="user/:user" element={<ProfileView />} />
                    <Route path={'order/:order'} element={<OrderView />} />
                    <Route path={'orders/:user'} element={<UserOrders />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </UserContext.Provider>
        </Router>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);

export default App;
