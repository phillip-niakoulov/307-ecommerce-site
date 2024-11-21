import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';

// import ImageGallery from '../components/ImageGallery.jsx';

const ProductView = () => {
    const navigate = useNavigate();

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { loggedIn, permissions } = useContext(UserContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_BACKEND_URL
                    }/api/products/${productId}`
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
    // const editedImageUrls = product.imageUrls.map(
    //     (url) => url.substring(0, 3) + url.substring(12)
    // );

    const addProductToCart = (quantity) => {
        if (!loggedIn) {
            return navigate('/login');
        }

        const cart = localStorage.getItem('cart')
            ? JSON.parse(atob(localStorage.getItem('cart')))
            : [];

        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.itemId === productId
        );

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                itemId: productId,
                quantity: 1,
                name: product.name,
            });
        }

        localStorage.setItem('cart', btoa(JSON.stringify(cart)));
    };

    return (
        <div>
            <h2 id={'name'}>{product.name}</h2>
            <p id={'description'}>{product.description}</p>
            <p id={'price'}>Price: ${product.originalPrice}</p>
            {/* <ImageGallery imageUrls={editedImageUrls} /> */}
            <div id={'buttons'}>
                <input
                    type={'button'}
                    value={'Add to Cart'}
                    onClick={() => addProductToCart(1)}
                />
                {permissions && permissions['update-product'] === true && (
                    <input
                        value={'Edit'}
                        type={'button'}
                        onClick={async () =>
                            navigate(`/product/${productId}/edit`)
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default ProductView;
