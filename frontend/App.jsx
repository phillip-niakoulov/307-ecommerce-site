import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/pages/home.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import Header from './src/components/Header.jsx';
import NotFound from './src/pages/NotFound.jsx';
import './src/styles/index.css';
import './src/styles/pages/header.css'
import './src/styles/pages/home.css'
import './src/styles/pages/login.css'
// import Footer from '../components/footer';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    </StrictMode>
);
