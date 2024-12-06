import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';
import '../styles/pages/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { loggedIn } = useContext(UserContext);
    const [cart, setCart] = useState([]);
    const [sum, setSum] = useState(0);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (!loggedIn) {
            return navigate('/login');
        }

        if (!localStorage.getItem('cart')) {
            return setCart([]);
        }
        const localCart = JSON.parse(atob(localStorage.getItem('cart')));
        setCart(localCart);
    }, [loggedIn, navigate]);

    useEffect(() => {
        let psum = 0;
        cart.forEach((item) => {
            psum += item['quantity'] * item['price'];
        });
        setSum(psum);
    }, [cart]);

    const updateQuantity = (product, newQuantity) => {
        const i = cart.findIndex((prod) => prod['itemId'] === product);
        if (i === -1 || newQuantity <= 0) {
            cart.splice(i, 1);
        } else {
            cart[i]['quantity'] = newQuantity;
        }

        setCart([...cart]);
        localStorage.setItem('cart', btoa(JSON.stringify(cart)));
    };

    async function checkout() {
        const res = await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/users/checkout`,
            {
                method: 'POST',
                body: JSON.stringify({ cart }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (res.status === 200) {
            localStorage.removeItem('cart');
            res.json().then((data) => {
                setOrderId(data._id);
            });
        }
    }

    if (orderId !== null) {
        return navigate(`/order/${orderId}`);
    }

    return (
        <div className="cart-container">
            {cart.length === 0 ? (
                <div className="empty-cart-message">No items in the cart</div>
            ) : (
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item['itemId']} className="cart-item">
                            <img
                                src={item['image']}
                                alt={item['name']}
                                className="item-image"
                            />
                            <div className="item-details">
                                <span className="item-name">
                                    {item['name']}
                                </span>
                                <br />
                                <span className="item-price">
                                    $
                                    {(item['price'] * item['quantity']).toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                            <div className="quantity-container">
                                <input
                                    type="number"
                                    min="1"
                                    value={item['quantity']}
                                    onChange={(e) =>
                                        updateQuantity(
                                            item['itemId'],
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="quantity-input"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {cart.length > 0 && (
                <div className="checkout-container">
                    <button className="checkout-button" onClick={checkout}>
                        Checkout (${sum.toFixed(2)})
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
