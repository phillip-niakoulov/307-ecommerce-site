import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react';
import '../../styles/pages/OrderListAdmin.css';
import OrderDetails from './OrderDetails.jsx';
import { UserContext } from '../../other/UserContext.jsx';
import OrderStatus from '../../other/OrderStatus.jsx';

const OrderListUser = () => {
    const context = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleDropdown = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    useEffect(() => {
        console.log(context.userId);
        if (!context.userId) return;

        const fetchOrders = async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/user/${
                        context.userId
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
    }, [context.userId]);

    if (loading) {
        return <div className="info">Loading...</div>;
    }

    return orders.length === 0 && !loading ? (
        <div className="info">No items (for now)</div>
    ) : (
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
                                    {Object.values(OrderStatus).filter(s => s.value === order.order_status?.status)[0]?.text}
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
    );
};

export default OrderListUser;
