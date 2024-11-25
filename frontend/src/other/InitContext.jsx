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
                const token = jwtDecode(localStorage.getItem('token'));
                const fetchData = async () => {
                    await fetch(
                        `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${token['userId']}`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        },
                    )
                        .then((response) => {
                            if (response.status === 403) {
                                setUserData({});
                                setLoggedIn(false);
                                localStorage.removeItem('token');
                                throw new Error('Unauthorized');
                            }
                            return response;
                        })
                        .then((res) => res.json())
                        .then((res) => {
                            setUserData(res['user']);
                            setPermissions(res['user']['permissions']);
                            setUserId(res['user']['_id']);
                            setLoggedIn(true);
                        })
                        .catch((error) => {
                            console.error(error);
                            setUserData({});
                        });
                };
                fetchData();
            }
        } catch (e) {
            console.error(e);
            setLoggedIn(false);
            setUserId('');
            setPermissions({});
            localStorage.removeItem('token');
        }
    }, [setLoggedIn, setPermissions, setUserId, loggedIn, setUserData]);
};
