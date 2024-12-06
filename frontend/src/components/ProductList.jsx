import { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import '../styles/components/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('name-asc');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    useEffect(() => {
        const handler = setTimeout(async () => {
            setLoading(true);

            try {
                let data;

                const sortParam = sortBy.split('-');
                const sortField = sortParam[0]; // 'name' or 'price'
                const sortOrder = sortParam[1]; // 'asc' or 'desc'

                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_BACKEND_URL
                    }/api/products/search?query=${query}&sortField=${sortField}&sortOrder=${sortOrder}`
                );
                data = await response.json();

                setProducts(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        }, 300); // milliseconds

        return () => {
            clearTimeout(handler);
        };
    }, [query, sortBy]);

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="search-input"
                />
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="sort-select"
                >
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                </select>
            </div>

            {loading ? (
                <p className="info">Loading...</p>
            ) : (
                <p className="info" style={{ visibility: 'hidden' }}>
                    Loading...
                </p>
            )}

            {products.length === 0 && loading === false ? (
                <p className="info">No items (for now)</p>
            ) : (
                <div className="product-list">
                    {products.map((item) => (
                        <div key={item._id} className="product-card-container">
                            <ProductCard
                                id={item._id}
                                imageUrl={item.imageUrls[0]}
                                name={item.name}
                                price={item.originalPrice}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
