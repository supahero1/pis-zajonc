"use client";

import {Alert, Button, TextField} from "@mui/material";
import Link from "next/link";
import {useContext, useState} from "react";
import {useRouter} from "next/navigation";
import {AuthContext} from "@/app/AuthContext";

export default function Page() {
    const [showAlert, setShowAlert] = useState(false)
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();


    const navigateToFrontPage = () => {
        router.push('/');
    };

    const {login} = useContext(AuthContext);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setLoginDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, loginDetails.username); // Save token in context or localStorage
                navigateToFrontPage();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed");
                setShowAlert(true);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            setShowAlert(true);
        }
    };

    return (
        <div className="user-login">
            {showAlert ? <Alert variant="filled" severity="error">
                Nieprawidłowe dane
            </Alert> : <div></div>}
            <form className="user-login-input">
                <TextField
                    name="username"
                    label="Login"
                    variant="outlined"
                    className="login-input-field"
                    value={loginDetails.username}
                    onChange={handleInputChange}
                    required
                />
                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    className="login-input-field"
                    value={loginDetails.password}
                    onChange={handleInputChange}
                    required
                />
                <Button
                    variant="contained"
                    color="black"
                    // TODO, change to API
                    onClick={() => handleLogin()}
                >
                    Login
                </Button>
                <Link href="/signup">No account? Create here</Link>
                <Button
                    variant="contained"
                    color="black"
                    onClick={navigateToFrontPage}
                >
                    Back
                </Button>
            </form>
        </div>
    )
}
