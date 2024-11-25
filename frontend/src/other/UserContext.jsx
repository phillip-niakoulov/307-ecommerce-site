import React from 'react';

export const UserContext = React.createContext({
    loggedIn: false,
    setLoggedIn: () => {},
    userId: '',
    setUserId: () => {},
    permissions: {},
    setPermissions: () => {},
    userData: {},
    setUserData: () => {
    },
});
