import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import ProductView from './src/pages/ProductView.jsx';
import Header from './src/components/Header.jsx';
import './src/styles/index.css';
import './src/styles/pages/header.css';
import './src/styles/pages/home.css';
import './src/styles/pages/login.css';
import NotFound from './src/pages/NotFound.jsx';
import AdminDashboard from './src/pages/AdminDashboard.jsx';
import ProductEdit from './src/pages/ProductEdit.jsx';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="product/:productId" element={<ProductView />} />
                <Route
                    path="product/:productId/edit"
                    element={<ProductEdit />}
                />
                <Route path="admin" element={<AdminDashboard />} />
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

export default App;
