import { useState, useEffect } from 'react';
import '../styles/components/Toast.css';

const Toast = ({ message, duration = 3000, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return <div className={`toast ${show ? 'show' : ''}`}>{message}</div>;
};

export default Toast;
