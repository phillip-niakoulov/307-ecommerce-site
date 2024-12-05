import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import '../../styles/pages/OrderListAdmin.css';
import OrderDetails from './OrderDetails.jsx';
import OrderStatus from '../../other/OrderStatus.jsx';

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
                                    {order._id}
                                </td>
                                <td className="orderlist-cell">
                                    <p>{order?.username}</p>
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
                                <td className="orderlist-cell">
                                    {new Date(
                                        order.order_status?.createdAt,
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                            {expandedOrder === order._id && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="orderlist-dropdown-cell"
                                    >
                                        <OrderDetails orderId={order._id} />
                                        Status:
                                        <select id={`${order._id}status`} onChange={() => {
                                            document.getElementById(`${order._id}save`).hidden = false;
                                        }} defaultValue={order.order_status?.status}>
                                            {Object.values(OrderStatus).map((text) => (
                                                <option key={`${order._id}${text['value']}`}
                                                        value={text['value']}>{text['text']}</option>
                                            ))}

                                        </select>
                                        <button hidden={true} onClick={async () => {
                                            const newStatus = document.getElementById(`${order._id}status`).value;
                                            const data = await fetch(
                                                `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/${order._id}`,
                                                {
                                                    method: 'PUT',
                                                    body: JSON.stringify({ status: newStatus }),
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        Authorization: `Bearer ${localStorage.getItem(
                                                            'token',
                                                        )}`,
                                                    },
                                                },
                                            );
                                            if (data.status === 201) {
                                                document.getElementById(`${order._id}save`).hidden = true;
                                            }
                                        }} id={`${order._id}save`}>Save
                                        </button>
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
