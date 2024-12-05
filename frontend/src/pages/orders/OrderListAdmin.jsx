import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/OrderListAdmin.css';

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
                data.json().then((json) => {
                    setOrders(json);
                });
            } catch (error) {
                console.log(error);
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
                    {orders
                        .sort((a, b) => {
                            const scompare =
                                a.order_status?.status.localeCompare(
                                    b.order_status?.status
                                );
                            if (scompare !== 0) {
                                return scompare;
                            }
                            return (
                                new Date(a.order_status?.createdAt) -
                                new Date(b.order_status?.createdAt)
                            );
                        })
                        .map((order) => (
                            <tr key={order._id}>
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
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderListAdmin;
