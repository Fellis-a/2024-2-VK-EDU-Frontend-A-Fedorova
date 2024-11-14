import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { refreshToken } from '../api/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [tokens, setTokens] = useState(null);
    const [userId, setUserId] = useState(null);
    const [firstName, setFirstName] = useState(null);

    // Загружаем токены и userId, когда они изменяются
    useEffect(() => {
        if (tokens?.userId) {
            setUserId(tokens.userId);
        } else {
            console.error('Tokens or userId not available:', tokens);
        }
    }, [tokens]);

    useEffect(() => {
        if (!tokens?.refresh) return; // Если токенов нет, не пытаться обновить их
        const interval = setInterval(async () => {
            try {
                const newTokens = await refreshToken(tokens.refresh);
                setTokens(newTokens);
                console.log('Token refreshed successfully');
            } catch (error) {
                console.error('Error during token refresh:', error);
            }
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [tokens]);

    useEffect(() => {
        const fetchCurrentUser = async (accessToken) => {
            try {
                const response = await fetch('https://vkedu-fullstack-div2.ru/api/user/current/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось получить данные текущего пользователя');
                }

                const data = await response.json();
                setFirstName(data.first_name);
                console.log('Данные текущего пользователя:', data); // Для отладки
                setUserId(data.id);
            } catch (error) {
                console.error('Ошибка при получении текущего пользователя:', error);
            }
        };

        if (tokens?.access) {
            fetchCurrentUser(tokens.access);
        }
    }, [tokens]);



    return (
        <AuthContext.Provider value={{ tokens, setTokens, userId, firstName }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};