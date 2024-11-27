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

    function create() {
        const request = new FormData(); // Use FormData to handle file uploads

        request.append('name', document.getElementById('name').value);
        request.append('originalPrice', document.getElementById('price').value);
        request.append(
            'description',
            document.getElementById('description').value,
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
                    // Don't set 'Content-Type' header when using FormData
                },
            },
        ).then(async (res) => {
            if (res.status === 201) {
                navigate(`/product/${productId}`);
                return;
            }
            res.json().then((j) => {
                document.getElementById('err').innerHTML = j['message'];
            });
        });
    }

    // Handle form submission

    return (
        <div>
            <h1>Edit Product</h1>
            <div>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            id={'name'}
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
                            id={'price'}
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
                            id={'description'}
                            value={productData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Category:
                        <input
                            name="category"
                            id={'category'}
                            value={productData.category}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Files:
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept={'image/gif,image/png,image/jpeg'}
                            multiple
                        />
                    </label>
                </div>
                <button type="submit" onClick={create}>
                    Save Changes
                </button>
                <div id="err"></div>
            </div>
        </div>
    );
};

export default ProductEdit;
