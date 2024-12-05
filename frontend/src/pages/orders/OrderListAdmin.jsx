import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/OrderListAdmin.css';
import OrderDetails from './OrderDetails.jsx';

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleDropdown = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/orders`,
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
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="orderlist-container">
            <table className="orderlist-table">
                <thead>
                    <tr>
                        <th className="orderlist-header">ID</th>
                        <th className="orderlist-header">Owner</th>
                        <th className="orderlist-header">Price</th>
                        <th className="orderlist-header">Status</th>
                        <th className="orderlist-header">Created At</th>
                        <th className="orderlist-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <React.Fragment key={order._id}>
                            <tr>
                                <td className="orderlist-cell">
                                    <Link
                                        to={`/order/${order._id}`}
                                        className="orderlist-link"
                                    >
                                        {order._id}
                                    </Link>
                                </td>
                                <td className="orderlist-cell">
                                    <Link
                                        to={`/user/${order.owner}`}
                                        className="orderlist-link"
                                    >
                                        {order?.username}
                                    </Link>
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
                                    {order.order_status?.status}
                                </td>
                                <td className="orderlist-cell">
                                    {new Date(
                                        order.order_status?.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td className="orderlist-cell">
                                    <button
                                        onClick={() =>
                                            toggleDropdown(order._id)
                                        }
                                        className="orderlist-dropdown-button"
                                    >
                                        {expandedOrder === order._id
                                            ? '^'
                                            : 'v'}
                                    </button>
                                </td>
                            </tr>
                            {expandedOrder === order._id && (
                                <tr>
                                    <td
                                        colSpan="6"
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
    );
};

export default OrderListAdmin;
