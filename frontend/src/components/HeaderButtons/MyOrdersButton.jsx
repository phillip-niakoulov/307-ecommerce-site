import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../other/UserContext.jsx';

const MyOrdersButton = () => {
    const context = useContext(UserContext);
    if (!context.loggedIn) {
        return null;
    }
    return <NavLink to={`/orders/${context.userId}`}>My Orders</NavLink>;
};
export default MyOrdersButton;
