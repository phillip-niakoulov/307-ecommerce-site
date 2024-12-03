import { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import { UserContext } from '../other/UserContext.jsx';
import LogoutButton from '../components/HeaderButtons/LogoutButton.jsx';

const ProfileView = () => {
    const { user } = useParams();
    const { setLoggedIn } = useContext(UserContext);
    const viewer = useContext(UserContext).userId;
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const deleteUser = async () => {
        return await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${viewer}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        );
    };

    const { userId, loggedIn, permissions } = useContext(UserContext);

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
                    return setProfileData(null);
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProfileData(data);
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

    if (!profileData) {
        return <NotFound />;
    }

    return (
        <div>
            {loggedIn && userId === user ? <LogoutButton /> : ''}
            {loggedIn && permissions?.['view-orders'] ? (
                <button
                    onClick={() => {
                        navigate(`/orders/${user}`);
                    }}
                >
                    View Orders
                </button>
            ) : (
                ''
            )}
            {loggedIn && user === userId ? (
                <button
                    onClick={async () => {
                        if ((await deleteUser()).ok) {
                            localStorage.clear();
                            setLoggedIn(false);
                            navigate(`/`);
                        }
                    }}
                >
                    Delete Account
                </button>
            ) : (
                ''
            )}
            <p>{JSON.stringify(profileData)}</p>
        </div>
    );
};

export default ProfileView;
