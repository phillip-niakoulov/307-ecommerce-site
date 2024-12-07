import { Link } from 'react-router-dom';
import '../styles/components/ProductCard.css';
import PropTypes from 'prop-types';

const ProductCard = ({ id, imageUrl, name, price }) => {
    ProductCard.propTypes = {
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
    };
    return (
        <div className="card" id={id}>
            <Link to={`/product/${id}`}>
                <img src={imageUrl} alt={name} className="card-image" />
                <div className="card-content">
                    <h3 className="card-name">{name}</h3>
                    <p className="card-price">${price.toFixed(2)}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
