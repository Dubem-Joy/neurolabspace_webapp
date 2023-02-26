import React, { useState,  useEffect } from 'react';
import Signup from './Authentication/Signup';
import Login from './Authentication/Login'
import { useHistory } from 'react-router-dom';


const Home = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [showSignup, setShowSignup] = useState(false);;
    const history = useHistory();


    useEffect(() => {
        // #checks if user is logged in
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo) {
            // history.push('/userpage')
        } 
    }, [history]);

    const handleShow = () => {
        setShowLogin(!showLogin);
        setShowSignup(!showSignup)
    }

    return (
        <div>
            <Login handleShow={ handleShow} showLogin={showLogin} />
            <Signup handleShow={ handleShow} showSignup={showSignup} />
        </div>
    );
};

export default Home;