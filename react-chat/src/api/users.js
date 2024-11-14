export const fetchUsers = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/users/', {
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


