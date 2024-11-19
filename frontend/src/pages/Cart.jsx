import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../other/UserContext.jsx';

const Cart = () => {
    const navigate = useNavigate();

    const { loggedIn } = useContext(UserContext);
    const [cart, setCart] = useState([]);
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

    return (
        <div>
            {cart.length === 0 ? (
                <p>No items (for now)</p>
            ) : (
                cart.map((item) =>
                    item == null ? (
                        ''
                    ) : (
                        <div key={item['itemId']}>
                            {item['name']} - {item['quantity']}
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
        </div>
    );
};
export default Cart;
