export const fetchUsers = async (accessToken) => {
    try {
        const response = await fetch('https://vkedu-fullstack-div2.ru/api/users/', {
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


