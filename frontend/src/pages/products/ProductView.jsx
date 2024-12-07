import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../other/UserContext.jsx';
import ImageGallery from '../../components/ImageGallery.jsx';
import Toast from '../../components/Toast.jsx';
import '../../styles/pages/ProductView.css';

const ProductView = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mostPopularProduct, setMostPopularProduct] = useState(null);
    const { loggedIn, permissions } = useContext(UserContext);
    const [showToast, setShowToast] = useState(false);

    // Fetch the product details
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

    // Fetch the highest-selling product
    useEffect(() => {
        const fetchMostPopular = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/products/highest-selling-item`,
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMostPopularProduct(data);
            } catch (err) {
                console.error('Error fetching the highest-selling product:', err);
            }
        };

        fetchMostPopular();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>No product found.</div>;

    const addProductToCart = () => {
        if (!loggedIn) {
            navigate('/login');
            return;
        }

        const cart = localStorage.getItem('cart')
            ? JSON.parse(atob(localStorage.getItem('cart')))
            : [];

        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.itemId === productId
        );

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                itemId: product._id,
                quantity: 1,
                name: product.name,
                price: product.originalPrice,
                image: product.imageUrls[0],
            });
        }

        localStorage.setItem('cart', btoa(JSON.stringify(cart)));

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const isMostPopular = mostPopularProduct && mostPopularProduct.id === product._id;

    return (
        <div className="product-view">
            <div className="product-layout">
                <div className="product-images">
                    <ImageGallery imageUrls={product.imageUrls} />
                </div>
                <div className="product-details">
                    <div>
                        <h2>{product.name}</h2>
                        {isMostPopular && <span className="most-popular-label">Most Popular</span>}
                        <p className="price">${product.originalPrice.toFixed(2)}</p>
                    </div>

                    <div className="description">{product.description}</div>

                    <div>
                        <button
                            className="cart-button"
                            onClick={addProductToCart}
                        >
                            Add to Cart
                        </button>
                        <div className="admin-buttons">
                            {permissions?.['update-product'] && (
                                <button
                                    onClick={() =>
                                        navigate(`/product/${productId}/edit`)
                                    }
                                >
                                    Edit
                                </button>
                            )}
                            {permissions?.['delete-product'] && (
                                <button
                                    onClick={async () => {
                                        await fetch(
                                            `${
                                                import.meta.env
                                                    .VITE_API_BACKEND_URL
                                            }/api/products/${productId}`,
                                            {
                                                method: 'DELETE',
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem(
                                                        'token'
                                                    )}`,
                                                },
                                            }
                                        );
                                        navigate('/');
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showToast && <Toast message="Added to cart!" />}
        </div>
    );
};

export default ProductView;
