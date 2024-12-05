import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import OrderStatus from '../../other/OrderStatus.jsx';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState([true]);

    const { user } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/user/${user}`,
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
    }, [user, orders, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Price</td>
                    <td>Status</td>
                    <td>CreatedAt</td>
                </tr>
                </thead>
                <tbody>
                {orders
                    .sort((a, b) => {
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
                                $
                                {order.cart
                                    .map((item) => {
                                        return item.price * item.quantity;
                                    })
                                    .reduce((a, b) => a + b, 0)
                                    .toFixed(2)}
                            </td>
                            <td>{Object.values(OrderStatus).filter(s => s.value === order.order_status?.status)[0]?.text}</td>
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

export default UserOrders;
