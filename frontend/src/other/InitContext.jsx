import { useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserContext.jsx';

export const InitContext = () => {
    const { setLoggedIn, loggedIn, setPermissions, setUserId, setUserData } =
        useContext(UserContext);
    useEffect(() => {
        try {
            setLoggedIn(localStorage.getItem('token') !== null);
            if (loggedIn) {
                const id = jwtDecode(localStorage.getItem('token'))['userId'];
                setUserId(id);
                const getData = async () => {
                    console.log('a');
                    await fetch(
                        `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            setUserData(data['user']);
                            setPermissions(data['user']['permissions']);
                        });
                };
                getData();
            }
        } catch (e) {
            console.log(e);
            setLoggedIn(false);
            setUserId('');
            setPermissions({});
            localStorage.removeItem('token');
        }
    }, [loggedIn, setLoggedIn, setPermissions, setUserId, setUserData]);
};

export default InitContext;
