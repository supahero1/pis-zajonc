"use client";

import {useContext, useState} from "react";
import {AuthContext} from "@/app/AuthContext";
import {useRouter} from "next/navigation";
import SearchIcon from '@mui/icons-material/Search';
import {IconButton} from "@mui/material";
import {usePathname} from 'next/navigation';

export default function NavBar() {
    const [searchItem, setSearchItem] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const noNavBarRoutes = ['/login/', '/signup/', '/checkout/']; // Add routes where you don't want NavBar

    // Conditionally render NavBar based on current route
    const shouldRenderNavBar = !noNavBarRoutes.includes(pathname);

    const handleChange = (e) => {
        setSearchItem(e.target.value);
    }
    const {authToken, logout, setSearchedWord} = useContext(AuthContext);
    const router = useRouter();

    const navigateToLogin = () => {
        router.push('/login');
    };

    const navigateToFrontPage = () => {
        setSearchedWord(null);
        router.push('/');
    };

    const navigateToCart = () => {
        router.push('/cart');
    }

    const handleSearch = () => {
        setSearchItem("");
    }

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
    };

    const navigateToHistory = () => {
        router.push('/history');
    }

    const handleSearchChange = () => {
        setSearchedWord(searchItem);
        console.log(searchItem);
        router.push('/');
    };

    return (
        shouldRenderNavBar ? (
            <div className="top-bar">
                <div className="shop-name" onClick={navigateToFrontPage} style={{cursor: "pointer"}}>
                    <img className="sigma-text" src="/logo.png" alt="SIGMA CHAD STORE"/>
                </div>
                <div className="search-bar">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search..."
                        value={searchItem}
                        onChange={handleChange}
                    />
                    <IconButton onClick={handleSearchChange} sx={{color: "white"}}>
                        <SearchIcon/>
                    </IconButton>
                </div>

                <div className="login">
                    {authToken ? (
                        <div className="account-settings-container">
                            <button className="front-page-button" onClick={toggleMenu}>
                                Account
                            </button>
                            <div className={`menu-options ${isMenuOpen ? "open" : ""}`}>
                                <div className="menu-option" onClick={navigateToHistory}>History</div>
                                <div className="menu-option" /*onClick={navigateToCart}*/>
                                    Cart
                                </div>
                                <div className="menu-option" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="account-settings-container">
                            <button className="front-page-button" onClick={navigateToLogin}>
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) : null
    )
}