import '../styles/pages/home.css';
import React, { useEffect } from 'react';

function Home() {
    const [products, setProducts] = React.useState([]);

    function getProducts() {
        return fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/products`
        ).then((response) => response.json());
    }

    useEffect(() => {
        getProducts()
            .then((result) => {
                setProducts(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <h1>Product List</h1>
            {products.length === 0 ? (
                <p>No items (for now)</p>
            ) : (
                products.map((item) => (
                    <div key={item._id}>
                        <a href={`/product/${item._id}`}>{item.name}</a>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
