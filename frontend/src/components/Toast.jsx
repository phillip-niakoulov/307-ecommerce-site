import { useEffect, useState } from 'react';
import '../styles/components/Toast.css';
import PropTypes from 'prop-types';

const Toast = ({ message, duration = 3000, onClose }) => {
    Toast.propTypes = {
        message: PropTypes.string,
        duration: PropTypes.number,
        onClose: PropTypes.func,
    };

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
