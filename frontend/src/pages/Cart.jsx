import { useEffect, useState } from 'react';

const Cart = () => {
    const [cart, setCart] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem('cart')) {
            return setCart([]);
        }
        const localCart = JSON.parse(atob(localStorage.getItem('cart')));
        setCart(localCart);
    }, []);

    const update = (product, delta) => {
        for (let i = 0; i < cart.length; i++) {
            if (!cart[i]) continue;
            if (cart[i]['itemId'] === product) {
                cart[i].quantity += delta;
                if (cart[i].quantity < 1) {
                    cart.splice(i, 1);
                }
            }
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
