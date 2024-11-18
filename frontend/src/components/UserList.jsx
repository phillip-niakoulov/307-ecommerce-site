import { useEffect, useState } from 'react';

const UserList = () => {
    // State Initialization
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modifiedPermissions, setModifiedPermissions] = useState({});
    const [changesMade, setChangesMade] = useState({});
    const [hasManagePermissions, setHasManagePermissions] = useState(false);
    const [hasDeletePermissions, setHasDeletePermissions] = useState(true);

    // Decode Token and Check Permissions
    useEffect(() => {
        try {
            const hasManagePermission = JSON.parse(
                localStorage.getItem('permissions')
            )['manage-permissions'];
            setHasManagePermissions(hasManagePermission);

            const hasDeletePermission = JSON.parse(
                localStorage.getItem('permissions')
            )['delete-users'];
            setHasDeletePermissions(hasDeletePermission);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }, []);

    // Fetch Users Logic
    const getUsers = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BACKEND_URL}/api/users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            if (!response.ok) throw new Error('Network response was not ok');

            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${userId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await getUsers();
        setUsers(result);

        return await response.json();
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const result = await getUsers();
                setUsers(result);

                const initialPermissions = result.reduce((acc, user) => {
                    acc[user._id] = { ...user.permissions };
                    return acc;
                }, {});

                const initialChanges = result.reduce((acc, user) => {
                    acc[user._id] = false;
                    return acc;
                }, {});

                setModifiedPermissions(initialPermissions);
                setChangesMade(initialChanges);
            } catch (err) {
                console.error('Error setting users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Permission Handlers
    const handleCheckboxChange = (userId, permission) => {
        if (!hasManagePermissions) return;

        setModifiedPermissions((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [permission]: !prev[userId][permission],
            },
        }));

        setChangesMade((prev) => ({
            ...prev,
            [userId]: true,
        }));
    };

    const handleConfirmChanges = async (userId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BACKEND_URL}/api/users/${userId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify({
                        permissions: modifiedPermissions[userId],
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to update permissions');

            const updatedUser = await response.json();

            setUsers((prev) =>
                prev.map((user) => (user._id === userId ? updatedUser : user))
            );

            setModifiedPermissions((prev) => ({
                ...prev,
                [userId]: { ...updatedUser.permissions },
            }));

            setChangesMade((prev) => ({
                ...prev,
                [userId]: false,
            }));

            if (userId == localStorage.getItem('userId')) {
                localStorage.setItem(
                    'permissions',
                    JSON.stringify(modifiedPermissions[userId])
                );

                setHasManagePermissions(
                    modifiedPermissions[userId]['manage-permissions']
                );
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    // Rendering Logic
    if (loading) {
        return <p>Loading users...</p>;
    }

    const renderUserPermissions = (user) =>
        Object.keys(user.permissions).map((permission) => (
            <div key={permission}>
                <label>
                    <input
                        type="checkbox"
                        checked={
                            modifiedPermissions[user._id]?.[permission] || false
                        }
                        onChange={() =>
                            handleCheckboxChange(user._id, permission)
                        }
                        disabled={!hasManagePermissions} // Disable if user lacks permission
                        style={{
                            cursor: hasManagePermissions
                                ? 'pointer'
                                : 'not-allowed',
                        }}
                    />
                    {permission}
                </label>
            </div>
        ));

    const renderUsers = () =>
        users.map((user) => (
            <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                    {renderUserPermissions(user)}
                    {changesMade[user._id] && hasManagePermissions && (
                        <button onClick={() => handleConfirmChanges(user._id)}>
                            Confirm Changes
                        </button>
                    )}
                </td>
                <td>
                    <button
                        onClick={() => deleteUser(user._id)}
                        disabled={
                            !hasDeletePermissions ||
                            localStorage.getItem('userId') == user._id
                        }
                        style={{
                            cursor: hasDeletePermissions
                                ? 'pointer'
                                : 'not-allowed',
                        }}
                    >
                        X
                    </button>
                </td>
            </tr>
        ));

    return (
        <div>
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Created At</th>
                        <th>Permissions</th>
                        <th>Delete User</th>
                    </tr>
                </thead>
                <tbody>{renderUsers()}</tbody>
            </table>
        </div>
    );
};

export default UserList;
