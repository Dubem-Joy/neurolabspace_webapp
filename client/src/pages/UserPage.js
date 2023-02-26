import React, { useEffect, useState } from 'react';
import { ProjectState } from '../context/projectProvider';
import Dashboard from './Dashboard';

const UserPage = () => {
    const { loggedUser, setLoggedUser } = ProjectState();

     useEffect(() => {
        // #update userinfo for UI
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setLoggedUser(userInfo)

    }, []);


    return (
        <>
            {loggedUser && <Dashboard />}
        </>
    );
};

export default UserPage 