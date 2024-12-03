import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OrderView = () => {
    const { order } = useParams();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        const getOrderData = async () => {
            await fetch(
                `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/${order}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            )
                .then((res) => {
                    setError(!res.ok);
                    return res.json();
                })
                .then((data) => {
                    setOrderData(data);
                })
                .catch((e) => {
                    setError(true);
                    console.error('Error getting order data', e);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        getOrderData();
    }, [order, setOrderData, setLoading, setError]);

    if (error) {
        return <div>Error</div>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Order Details</h1>
            <table>
                <thead>
                <tr>
                    <td>Item</td>
                    <td>Quantity</td>
                    <td>Total Price</td>
                </tr>
                </thead>
                <tbody>
                {orderData?.cart?.map((item) => {
                    return (
                        <tr key={item.itemId}>
                            <td>
                                {
                                    <Link to={`/product/${item.itemId}`}>
                                        {' '}
                                        {item.name}
                                    </Link>
                                }
                            </td>
                            <td>{item.quantity}</td>
                            <td>
                                ${(item.price * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    );
                })}
                <tr>
                    <td>Total</td>
                    <td>
                        {orderData?.cart
                            ?.map((item) => {
                                return item?.quantity;
                            })
                            .reduce((a, b) => a + b, 0)}
                    </td>
                    <td>
                        $
                        {orderData?.cart
                            ?.map((item) => {
                                return item?.quantity * item?.price;
                            })
                            .reduce((a, b) => a + b, 0)
                            .toFixed(2)}
                    </td>
                </tr>
                </tbody>
            </table>
            Purchaser:{' '}
            {
                <Link to={`/user/${orderData?.owner}`}>
                    {orderData?.username}
                </Link>
            }{' '}
            Status: {orderData?.order_status?.status} <br />
            Placed On:{' '}
            {new Date(
                orderData?.order_status?.createdAt,
            ).toLocaleDateString()}{' '}
            At: {new Date(orderData?.order_status?.createdAt).toTimeString()}
            <br />
            Updated On:{' '}
            {new Date(
                orderData?.order_status?.updatedAt,
            ).toLocaleDateString()}{' '}
            At: {new Date(orderData?.order_status?.updatedAt).toTimeString()}
        </div>
    );
};
export default OrderView;
