import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('name-asc');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    useEffect(() => {
        const handler = setTimeout(async () => {
            setLoading(true); // Set loading to true at the start of the request

            try {
                let data;

                const sortParam = sortBy.split('-'); // Split the sortBy value into field and order
                const sortField = sortParam[0]; // 'name' or 'price'
                const sortOrder = sortParam[1]; // 'asc' or 'desc'

                // Fetch products based on the search query
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_BACKEND_URL
                    }/api/products/search?query=${query}&sortField=${sortField}&sortOrder=${sortOrder}`
                );
                data = await response.json();

                console.log('Search results:', data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false); // Set loading to false after the request completes
            }
        }, 300); // Debounce time in milliseconds

        return () => {
            clearTimeout(handler); // Cleanup the timeout on unmount or when query changes
        };
    }, [query, sortBy]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                style={{ padding: '10px', width: '200px', marginRight: '10px' }}
            />
            <select
                value={sortBy}
                onChange={handleSortChange}
                style={{ marginRight: '10px' }}
            >
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="name-desc">Alphabetical (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
            </select>
            {loading ? (
                <span>Loading...</span>
            ) : (
                <span style={{ visibility: 'hidden' }}>Loading...</span> // Keep space for loading text
            )}
            <div>
                {products.length === 0 ? (
                    <p>No items (for now)</p>
                ) : (
                    products.map((item) => (
                        <div key={item._id}>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;
