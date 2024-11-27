import { Link } from 'react-router-dom';
import '../styles/components/ProductCard.css';

const ProductCard = ({ id, imageUrl, name, price }) => {
    return (
        <div className="card" id={id}>
            <Link to={`/product/${id}`}>
                <img src={imageUrl} alt={name} className="card-image" />
                <div className="card-content">
                    <h3 className="card-name">{name}</h3>
                    <p className="card-price">${price}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
