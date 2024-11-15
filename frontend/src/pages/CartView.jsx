import React, { useEffect } from 'react';

const CartView = () => {
    const [cart, setCart] = React.useState([]);

    function getCart() {
        return fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/carts`, {
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
                            const res = await fetch(
                                `${
                                    import.meta.env.VITE_API_BACKEND_URL
                                }/api/carts`,
                                {
                                    method: 'Put',
                                    body: JSON.stringify({
                                        product: product.id,
                                        count: product.count + 1,
                                    }),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `${localStorage.getItem(
                                            'token'
                                        )}`,
                                    },
                                }
                            );
                            if (res.status === 201) {
                                setCart(await getCart());
                            }
                        }}
                    />
                    <input
                        type={'button'}
                        value={'-'}
                        onClick={async () => {
                            const res = await fetch(
                                `${
                                    import.meta.env.VITE_API_BACKEND_URL
                                }/api/carts`,
                                {
                                    method: 'PUT',
                                    body: JSON.stringify({
                                        product: product.id,
                                        count: product.count - 1,
                                    }),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `${localStorage.getItem(
                                            'token'
                                        )}`,
                                    },
                                }
                            );
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
