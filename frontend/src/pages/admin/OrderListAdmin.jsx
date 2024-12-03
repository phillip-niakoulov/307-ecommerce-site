import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/orders`,
                    {
                        Method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
    }, [setLoading, setOrders]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Owner</td>
                    <td>Price</td>
                    <td>Status</td>
                    <td>CreatedAt</td>
                </tr>
                </thead>
                <tbody>
                {orders
                    .toSorted((a, b) => {
                        const scompare = a.order_status?.status
                            .toLocaleString()
                            .localeCompare(
                                b.order_status?.status.toLocaleString(),
                            );
                        if (scompare !== 0) {
                            return scompare;
                        }
                        return (
                            a.order_status?.createdAt -
                            b.order_status?.createdAt
                        );
                    })
                    .map((order) => (
                        <tr key={order._id}>
                            <td>
                                <Link to={`/order/${order._id}`}>
                                    {order._id}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/user/${order.owner}`}>
                                    {order?.username}
                                </Link>
                            </td>
                            <td>
                                $
                                {order.cart
                                    .map((item) => {
                                        return item.price * item.quantity;
                                    })
                                    .reduce((a, b) => a + b, 0)}
                            </td>
                            <td>{order.order_status?.status}</td>
                            <td>
                                {new Date(
                                    order.order_status?.createdAt,
                                ).toDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderListAdmin;
