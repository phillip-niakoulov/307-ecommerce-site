import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ImageGallery from '../components/ImageGallery.jsx';

const api = 'http://localhost:5000';

const ProductView = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${api}/api/products/${productId}`
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    // ..\frontend\src\assets\1730854940588-Screenshot_2024_08_14_144600.png
    // ..\src\assets\1730854940588-Screenshot_2024_08_14_144600.png

    // SORRY, SHITTY SOLUTION I'LL DEAL WITH LATER
    const editedImageUrls = product.imageUrls.map(
        (url) => url.substring(0, 3) + url.substring(12)
    );

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.originalPrice}</p>
            <ImageGallery imageUrls={editedImageUrls} />
        </div>
    );
};

export default ProductView;
