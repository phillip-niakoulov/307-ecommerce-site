import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';
import OrderPlaced from './OrderPlaced.jsx';

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
        cart.map((item) => {
            psum += item['quantity'] * item['price'];
        });
        setSum(psum);
    }, [cart, setSum]);
    const update = (product, delta) => {
        const i = cart.findIndex((prod) => prod['itemId'] === product);
        if (i === -1) return;
        cart[i]['quantity'] += delta;
        if (cart[i]['quantity'] < 1) {
            cart.splice(i, 1);
        }

        setCart(cart.map((item) => item));
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
        return <OrderPlaced />;
    }

    return (
        <div id={'cart'}>
            {cart.length === 0 ? (
                <p>No items (for now)</p>
            ) : (
                cart.map((item) =>
                    item == null ? (
                        ''
                    ) : (
                        <div key={item['itemId']}>
                            {item['name']} - {item['quantity']} ($
                            {(item['price'] * item['quantity']).toFixed(2)})
                            <button onClick={() => update(item['itemId'], 1)}>
                                +
                            </button>
                            <button onClick={() => update(item['itemId'], -1)}>
                                -
                            </button>
                        </div>
                    )
                )
            )}
            {cart.length === 0 ? (
                ''
            ) : (
                <div>
                    <button onClick={() => checkout()}>
                        Checkout (${sum.toFixed(2)})
                    </button>
                </div>
            )}
        </div>
    );
};
export default Cart;
