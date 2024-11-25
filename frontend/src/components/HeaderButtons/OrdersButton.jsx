import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const OrdersButton = () => {
    const { loggedIn, permissions } = useContext(UserContext);
    const [orderCount, setOrderCount] = useState(NaN);

    useEffect(() => {
        async function fetchOrders() {
            return await fetch(
                `${import.meta.env.VITE_API_BACKEND_URL}/api/orders/`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
                .then((res) => {
                    if (res.status !== 200) {
                        setOrderCount(NaN);
                    }
                    return res.json();
                })
                .then((json) => {
                    json = json.filter((item) => {
                        return (
                            item['order_status']['status'].toString() ===
                            'active'
                        );
                    });
                    setOrderCount(json.length);
                })
                .catch(() => {
                    setOrderCount(NaN);
                });
        }

        fetchOrders();
    }, [setOrderCount]);
    if (loggedIn && permissions !== null && permissions['view-orders']) {
        return <Link to="/orders">Orders ({orderCount})</Link>;
    }
    return '';
};
export default OrdersButton;
