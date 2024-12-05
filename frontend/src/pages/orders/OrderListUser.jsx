import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import '../../styles/pages/OrderListAdmin.css';
import OrderDetails from './OrderDetails.jsx';
import OrderStatus from '../../other/OrderStatus.jsx';
import { useParams } from 'react-router-dom';

const OrderListUser = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const { user } = useParams();

    const toggleDropdown = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/user/${
                        user
                    }`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                );
                if (!data.ok) {
                    setOrders(null);
                    return;
                }
                const json = await data.json();
                setOrders(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) {
        return <div className="info">Loading...</div>;
    }

    return orders.length === 0 && !loading ? (
        <div className="info">No items (for now)</div>
    ) : (
        <div>
            <h1>{orders[0]?.username}'s Orders</h1>
        <div className="orderlist-container">
            <table className="orderlist-table">
                <thead>
                    <tr>
                        <th className="orderlist-header">Date</th>
                        <th className="orderlist-header">Price</th>
                        <th className="orderlist-header">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <React.Fragment key={order._id}>
                            <tr
                                onClick={() => toggleDropdown(order._id)}
                                className="orderlist-row"
                            >
                                <td className="orderlist-cell">
                                    <FontAwesomeIcon
                                        icon={
                                            expandedOrder === order._id
                                                ? faChevronUp
                                                : faChevronDown
                                        }
                                        style={{ marginRight: '8px' }}
                                    />
                                    {new Date(
                                        order.order_status?.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td className="orderlist-cell">
                                    $
                                    {order.cart
                                        .reduce(
                                            (total, item) =>
                                                total +
                                                item.price * item.quantity,
                                            0
                                        )
                                        .toFixed(2)}
                                </td>
                                <td className="orderlist-cell">
                                    {Object.values(OrderStatus).filter(s => s.value === order.order_status?.status)[0]?.text} (
                                    {new Date(order.order_status?.updatedAt).toLocaleDateString()})
                                </td>
                            </tr>
                            {expandedOrder === order._id && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="orderlist-dropdown-cell"
                                    >
                                        <OrderDetails orderId={order._id} />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default OrderListUser;
