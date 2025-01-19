"use client";

import React, {createContext, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import axios from "axios"; // Or use localStorage instead

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(0);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [searchedWord, setSearchedWord] = useState(null);

    useEffect(() => {
        // Load auth token on page load
        const token = Cookies.get('authToken');
        if (token) {

            setAuthToken(token);
            getCredentials(token);

        }
    }, []);

    const getCredentials = async (token) => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${token}`);

        setEmail(res.data.surname);
        console.log(res.data);
        setUsername(res.data.username);
    }

    const login = (token) => {
        setAuthToken(token);
        Cookies.set('authToken', token, {expires: 7}); // Save token
        getCredentials(token);
    };

    const addProductToCart = (item) => {
        setCartProducts([...cartProducts, item]);
        console.log(cartProducts);
    };

    const logout = () => {
        setAuthToken(null);
        Cookies.remove('authToken');
    };

    return (
        <AuthContext.Provider value={{
            authToken,
            email,
            login,
            logout,
            username,
            cartProducts,
            addProductToCart,
            searchedWord,
            setSearchedWord
        }}>
            {children}
        </AuthContext.Provider>
    );
};
