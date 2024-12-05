import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/components/OrderDetails.css';

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
        return <div className="info">Loading details...</div>;
    }

    if (!details) {
        return <div>Error loading order details.</div>;
    }

    return (
        <div className="order-details-container">
            <h4 className="order-details-heading">Order Details</h4>
            <ul className="order-items-list">
                {details.cart.map((item) => (
                    <li key={item.itemId} className="order-item">
                        <Link
                            to={`/product/${item.itemId}`}
                            className="item-link"
                        >
                            {item.name}
                        </Link>{' '}
                        - {item.quantity} x ${item.price.toFixed(2)} = $
                        {(item.quantity * item.price).toFixed(2)}
                    </li>
                ))}
            </ul>
            <div className="order-summary">
                <p>
                    <strong>Total Items:</strong>{' '}
                    {details.cart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p>
                    <strong>Total Price:</strong> $
                    {details.cart
                        .reduce(
                            (sum, item) => sum + item.quantity * item.price,
                            0
                        )
                        .toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default OrderDetails;
