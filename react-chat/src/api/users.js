import { authFetch } from './auth.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUsers = async (accessToken, page = 1, pageSize = 300) => {
    try {
        const response = await authFetch(`${BASE_URL}/api/users/?page=${page}&page_size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка при получении пользователей: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const fetchAllUsers = async (accessToken) => {
    const allUsers = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await authFetch(`${BASE_URL}/api/users/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка при получении пользователей: ${response.statusText}`);
            }

            const data = await response.json();
            allUsers.push(...data.results);
            hasMore = !!data.next;
            page += 1;
        }
    } catch (error) {
        console.error('Ошибка загрузки всех пользователей:', error);
        throw error;
    }

    return allUsers;
};

