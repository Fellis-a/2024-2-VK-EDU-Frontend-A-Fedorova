import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { refreshToken } from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [tokens, setTokens] = useState(null);
    const [userId, setUserId] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedTokens = JSON.parse(localStorage.getItem('tokens'));
        if (savedTokens?.access && savedTokens?.refresh) {
            setTokens(savedTokens);
        }
    }, []);

    useEffect(() => {
        if (tokens) {
            localStorage.setItem('tokens', JSON.stringify(tokens));
        } else {
            localStorage.removeItem('tokens');
        }
    }, [tokens]);

    const refreshTokens = async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            if (!tokens?.refresh) throw new Error('No refresh token available');
            const newTokens = await refreshToken(tokens.refresh);
            setTokens(newTokens);
            return newTokens;
        } catch (error) {
            console.error('Token refresh failed:', error);
            setTokens(null);
            localStorage.removeItem('tokens');
        } finally {
            setRefreshing(false);
        }
    };

    const fetchCurrentUser = async () => {
        if (!tokens?.access) {
            console.error('No access token available');
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/user/current/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const user = await response.json();
                setFirstName(user.first_name);
                setUserId(user.id);
            } else if (response.status === 401) {
                console.log('Access token expired or invalid. Refreshing...');
                const newTokens = await refreshTokens();
                if (newTokens) {
                    fetchCurrentUser();
                }
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (tokens?.access) {
            fetchCurrentUser();
        }
    }, [tokens]);

    useEffect(() => {
        if (!tokens?.access || !tokens?.refresh) return;

        const accessPayload = JSON.parse(atob(tokens.access.split('.')[1]));
        const expiryTime = accessPayload.exp * 1000 - 60000;

        const timeout = setTimeout(async () => {
            try {
                const newTokens = await refreshTokens();
                if (newTokens) {
                    console.log('Tokens refreshed successfully');
                }
            } catch (error) {
                console.error('Token refresh failed:', error);
            }
        }, expiryTime - Date.now());

        return () => clearTimeout(timeout);
    }, [tokens]);

    return (
        <AuthContext.Provider value={{ tokens, setTokens, userId, firstName, refreshTokens, currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
