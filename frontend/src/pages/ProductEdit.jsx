import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductView from './ProductView.jsx';

const ProductEdit = () => {
    const navigate = useNavigate();

    const { productId } = useParams();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const perms = JSON.parse(localStorage.getItem('permissions'));

        setPermissions(perms || {});
    }, []);

    if (permissions['update-product'] === false) {
        return navigate(`/product/${productId}`);
    }

    return <ProductView productId={productId} />;
};
export default ProductEdit;
