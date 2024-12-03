import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';
import '../styles/pages/ProductCreate.css'; // Import the same CSS file

const ProductEdit = () => {
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
    });

    const { productId } = useParams();

    const { permissions } = useContext(UserContext);

    useEffect(() => {
        if (!permissions['update-product']) {
            return navigate(`/product/${productId}`);
        }
    }, [navigate, productId, permissions]);

    // Fetch product details
    useEffect(() => {
        const fetchProductData = async () => {
            await fetch(
                `${
                    import.meta.env.VITE_API_BACKEND_URL
                }/api/products/${productId}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setProductData(data);
                });
        };
        fetchProductData();
    }, [productId]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    function saveChanges() {
        const request = new FormData(); // Use FormData for file uploads

        request.append('name', document.getElementById('name').value);
        request.append('originalPrice', document.getElementById('price').value);
        request.append(
            'description',
            document.getElementById('description').value
        );
        request.append('category', document.getElementById('category').value);

        const files = document.getElementById('images').files;
        for (let i = 0; i < files.length; i++) {
            request.append('images', files[i]);
        }

        if (isNaN(parseFloat(request.get('originalPrice')))) {
            document.getElementById('err').innerHTML = 'Invalid price';
            return;
        }

        fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/products/${productId}`,
            {
                method: 'PUT',
                body: request,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    // Don't set 'Content-Type' when using FormData
                },
            }
        ).then(async (res) => {
            if (res.status === 200) {
                navigate(`/product/${productId}`);
                return;
            }
            res.json().then((j) => {
                document.getElementById('err').innerHTML = j['message'];
            });
        });
    }

    return (
        <div id="product_fields">
            {' '}
            {/* Apply the same class as ProductCreate */}
            <h2>Edit Product</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="price">Price:</label>
                <input
                    type="text"
                    id="price"
                    name="price"
                    value={productData.originalPrice}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    required
                ></textarea>

                <label htmlFor="category">Category:</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="images">Images:</label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/gif,image/png,image/jpeg"
                    multiple
                />

                <input
                    type="submit"
                    onClick={saveChanges}
                    value="Save Changes"
                />
                <div id="err"></div>
            </form>
        </div>
    );
};

export default ProductEdit;
