import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const fetchOrderDetails = async (orderId) => {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/${orderId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return res.json();
    } catch (err) {
        console.error('Error fetching order details:', err);
        return null;
    }
};

const OrderDetails = ({ orderId }) => {
    OrderDetails.propTypes = {
        orderId: PropTypes.string,
    };
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await fetchOrderDetails(orderId);
            setDetails(data);
            setLoading(false);
        };
        fetchDetails();
    }, [orderId]);

    if (loading) {
        return <div>Loading details...</div>;
    }

    if (!details) {
        return <div>Error loading order details.</div>;
    }

    return (
        <div>
            <h4>Order Details</h4>
            <ul>
                {details.cart.map((item) => (
                    <li key={item.itemId}>
                        <Link to={`/product/${item.itemId}`}>{item.name}</Link>{' '}
                        - {item.quantity} x ${item.price.toFixed(2)} = $
                        {(item.quantity * item.price).toFixed(2)}
                    </li>
                ))}
            </ul>
            <p>
                Total Items:{' '}
                {details.cart.reduce((sum, item) => sum + item.quantity, 0)} |
                Total Price: $
                {details.cart
                    .reduce((sum, item) => sum + item.quantity * item.price, 0)
                    .toFixed(2)}
            </p>
        </div>
    );
};

export default OrderDetails;
