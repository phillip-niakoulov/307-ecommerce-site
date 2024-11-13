import React, { useEffect } from 'react';

import { api } from '../common/common.jsx';

const CartView = () => {
    const [cart, setCart] = React.useState([]);

    function getCart() {
        return fetch(`${api}/api/carts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
        }).then((response) => response.json());
    }

    useEffect(() => {
        getCart()
            .then((result) => {
                setCart(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            {cart.map((product) => (
                <div key={product.id}>
                    {product.id}: {product.count}
                    <input
                        type={'button'}
                        value={'+'}
                        onClick={async () => {
                            const res = await fetch(`${api}/api/carts`, {
                                method: 'Put',
                                body: JSON.stringify({
                                    product: product.id,
                                    count: product.count + 1,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `${localStorage.getItem('token')}`,
                                },
                            });
                            if (res.status === 201) {
                                setCart(await getCart());
                            }
                        }}
                    />
                    <input
                        type={'button'}
                        value={'-'}
                        onClick={async () => {
                            const res = await fetch(`${api}/api/carts`, {
                                method: 'PUT',
                                body: JSON.stringify({
                                    product: product.id,
                                    count: product.count - 1,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `${localStorage.getItem('token')}`,
                                },
                            });
                            if (res.status === 201) {
                                setCart(await getCart());
                            }
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default CartView;
