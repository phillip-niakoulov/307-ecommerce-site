import React, { useEffect } from 'react';

const CartView = () => {
    const [cart, setCart] = React.useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart'))
            : [];

        const sortedCart = storedCart.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCart(sortedCart);
    }, []);

    const editProduct = (productId, quantity) => {
        const updatedCart = [...cart];
        const existingItemIndex = updatedCart.findIndex(
            (cartItem) => cartItem.itemId === productId
        );

        if (existingItemIndex >= 0) {
            updatedCart[existingItemIndex].quantity += quantity;

            if (updatedCart[existingItemIndex].quantity <= 0) {
                updatedCart.splice(existingItemIndex, 1); // Remove item if quantity <= 0
            }
        } else {
            console.error('No item found');
        }

        setCart(updatedCart); // Update state
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div>
            <h1>Cart View</h1>
            {cart.map((product) => (
                <div key={product.itemId}>
                    {product.itemId}: {product.quantity}
                    <input
                        type="button"
                        value="+"
                        onClick={() => {
                            editProduct(product.itemId, 1);
                        }}
                    />
                    <input
                        type="button"
                        value="-"
                        onClick={() => {
                            editProduct(product.itemId, -1);
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default CartView;
