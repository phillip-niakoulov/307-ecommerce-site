import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';

const ProfileView = () => {
    const { user } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${user}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (response.status === 401) {
                    localStorage.removeItem('token');

                    return navigate('/login');
                }
                if (response.status === 403 || response.status === 404) {
                    return setUserData(null);
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <NotFound />;
    }

    return <p>{JSON.stringify(userData)}</p>;
};

export default ProfileView;
