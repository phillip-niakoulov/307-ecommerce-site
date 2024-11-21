import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductView from './ProductView.jsx';
import { UserContext } from '../other/UserContext.jsx';

const ProductEdit = () => {
    const navigate = useNavigate();

    const { productId } = useParams();
    const { permissions } = useContext(UserContext);

    if (permissions['update-product'] === false) {
        return navigate(`/product/${productId}`);
    }

    return <ProductView productId={productId} />;
};
export default ProductEdit;
