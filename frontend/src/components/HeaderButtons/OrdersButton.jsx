import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../other/UserContext.jsx';

const OrdersButton = () => {
    const { loggedIn, permissions } = useContext(UserContext);


    if (loggedIn &&
        permissions !== null &&
        permissions['view-orders']) {
        return (<Link to="/orders">Orders</Link>);
    }
    return '';
};
export default OrdersButton;