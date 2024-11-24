import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';

const ProductEdit = () => {
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        description: '',
    });

    const { productId } = useParams();

    const { permissions } = useContext(UserContext);

    useEffect(() => {
        if (!permissions['update-product']) {
            return navigate(`/product/${productId}`);
        }
    }, [navigate, productId, permissions]);

    // Fetch product details (simulate API call)
    useEffect(() => {
        const fetchProductData = async () => {
            await fetch(
                `${import.meta.env.VITE_API_BACKEND_URL}/api/products/${productId}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setProductData(data);
                });
        };
        fetchProductData();
    }, [setProductData, productId]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_BACKEND_URL
                }/api/products/${productId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                }
            );

            if (response.ok) {
                navigate(`/product/${productId}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Price:
                        <input
                            name="originalPrice"
                            value={productData.originalPrice}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ProductEdit;
