import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import ProductView from './src/pages/ProductView.jsx';
import Header from './src/components/Header.jsx';
import ProductCreate from './src/pages/ProductCreate.jsx';
import NotFound from './src/pages/NotFound.jsx';
import AdminDashboard from './src/pages/AdminDashboard.jsx';
import RegisterAdmin from './src/pages/RegisterAdmin.jsx';
import CartView from './src/pages/CartView.jsx';

// import Footer from '../components/footer';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for JWT token in local storage
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally, you can verify the token here
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="registeradmin" element={<RegisterAdmin />} />
                <Route path="cart" element={<CartView />} />
                <Route path="product/create" element={<ProductCreate />} />
                <Route path="product/:productId" element={<ProductView />} />
                <Route
                    path="admin"
                    element={
                        isAuthenticated ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
