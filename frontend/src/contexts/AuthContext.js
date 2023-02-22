import { createContext, useCallback, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens')
            ? jwt_decode(JSON.parse(localStorage.getItem('authTokens')).access)
            : null
    );
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    );
    const [loading, setLoading] = useState(true);

    let loginUser = async (e) => {
        e.preventDefault();

        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });

        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/');
        } else {
            alert('Something Went Wrong');
        }
    };

    let logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    }, [navigate]);

    let updateToken = useCallback(
        async (e) => {
            console.log('Updated Token!');

            let response = await fetch(
                'http://127.0.0.1:8000/api/token/refresh/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refresh: authTokens?.refresh,
                    }),
                }
            );
            let data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/');
            } else {
                logoutUser();
            }

            loading && setLoading(false);
        },
        [authTokens, logoutUser, navigate, loading]
    );

    let contextData = {
        loginUser,
        logoutUser,
        user,
        authTokens,
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        let fourMinutes = 1000 * 60 * 4;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes);
        return () => {
            clearInterval(interval);
        };
    }, [authTokens, loading, updateToken]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
