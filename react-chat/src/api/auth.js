const BASE_URL = 'https://vkedu-fullstack-div2.ru';

export async function registerUser(userData) {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('bio', userData.bio);
    if (userData.avatar) {
        formData.append('avatar', userData.avatar);
    }

    try {
        const response = await fetch(`${BASE_URL}/api/register/`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Registration error details:", errorData);
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}
export async function loginUser(credentials) {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login response:', data);
        // Сохранение токенов и userId
        const tokens = { ...data, userId: data.user_id };
        localStorage.setItem('tokens', JSON.stringify(tokens));

        return tokens;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


export async function refreshToken(refreshToken) {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Refresh token error:', error);
        throw error;
    }
}

