import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import ProductView from './src/pages/ProductView.jsx';
import Header from './src/components/Header.jsx';
import './src/styles/index.css';
import './src/styles/pages/header.css'
import './src/styles/pages/home.css'
import './src/styles/pages/login.css'
import ProductCreate from './src/pages/ProductCreate.jsx';
import NotFound from './src/pages/NotFound.jsx';
import RegisterAdmin from './src/pages/RegisterAdmin.jsx';
import CartView from './src/pages/CartView.jsx';

// import Footer from '../components/footer';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="registeradmin" element={<RegisterAdmin />} />
                <Route path="cart" element={<CartView />} />
                <Route path="product/create" element={<ProductCreate />} />
                <Route path="*" element={<NotFound />} />
                <Route path="product/:productId" element={<ProductView />} />
            </Routes>
        </Router>
    </StrictMode>
);
