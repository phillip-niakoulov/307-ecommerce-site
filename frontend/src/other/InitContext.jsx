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
                    await fetch(
                        `${
                            import.meta.env.VITE_API_BACKEND_URL
                        }/api/users/${id}`,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem(
                                    'token'
                                )}`,
                            },
                        }
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            // IDK, the first one doesn't work for me and I don't want to figure out the real issue
                            if (data['user']) {
                                setUserData(data?.['user']);
                                setPermissions(data?.['user']?.['permissions']);
                            } else {
                                setUserData(data);
                                setPermissions(data?.['permissions']);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            localStorage.removeItem('token');
                            setLoggedIn(false);
                        });
                };
                getData();
            }
        } catch (e) {
            localStorage.removeItem('token');
            console.log(e);
            setLoggedIn(false);
            setUserId('');
            setPermissions({});
        }
    }, [loggedIn, setLoggedIn, setPermissions, setUserId, setUserData]);
};

export default InitContext;
