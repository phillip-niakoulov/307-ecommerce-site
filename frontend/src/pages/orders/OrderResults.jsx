import { useParams } from 'react-router-dom';
import '../../styles/pages/OrderResults.css';

const OrderResults = () => {
    const { order } = useParams();

    return (
        <div className="order-results-container">
            <h1 className="order-results-title">Thanks for your purchase!</h1>
            <h5 className="order-results-number">
                Your order number is: <strong>#{order}</strong>
            </h5>
        </div>
    );
};

export default OrderResults;
