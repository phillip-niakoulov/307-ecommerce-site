import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
                    },
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

    return <div>{JSON.stringify(orders)}</div>;
};

export default UserOrders;
