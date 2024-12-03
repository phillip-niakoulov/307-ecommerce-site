import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../other/UserContext.jsx';

const MyOrdersButton = () => {
    const context = useContext(UserContext);
    if (!context.loggedIn) {
        return null;
    }
    return <Link to={`/orders/${context.userId}`}>My Orders</Link>;
};
export default MyOrdersButton;