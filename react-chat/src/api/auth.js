const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import useAuthStore from '../store/authStore';

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
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error("Registration error details:", errorData);
                throw { message: 'Registration failed', details: errorData };
            } else {
                const errorText = await response.text();
                console.error("Unexpected error response:", errorText);
                throw { message: 'Unexpected error', details: errorText };
            }
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
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error("Login error details:", errorData);
                throw { message: 'Login failed', details: errorData };
            } else {
                const errorText = await response.text();
                console.error("Unexpected error response:", errorText);
                throw { message: 'Unexpected error', details: errorText };
            }
        }

        const data = await response.json();
        console.log('Login response:', data);
        const tokens = { ...data, userId: data.user_id };
        sessionStorage.setItem('tokens', JSON.stringify(tokens));

        if (!data.user_id) {
            const userResponse = await fetch(`${BASE_URL}/api/user/current/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (userResponse.ok) {
                const user = await userResponse.json();
                tokens.userId = user.id;
                sessionStorage.setItem('tokens', JSON.stringify(tokens));
                console.log('User data fetched:', user);
            } else {
                console.error('Failed to fetch user data');
            }
        }

        return tokens;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}


export const refreshToken = async (refreshToken) => {
    try {
        const response = await authFetch(`${BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: {

                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const newTokens = await response.json();
        return newTokens;
    } catch (error) {
        console.error('Refresh token error:', error);
        throw error;
    }
};


export const authFetch = async (url, options = {}) => {
    const { tokens, refreshTokens } = useAuthStore.getState();

    if (!tokens?.access) throw new Error('No access token');

    const { exp } = JSON.parse(atob(tokens.access.split('.')[1]));
    if (Date.now() > exp * 1000) {
        await refreshTokens();
    }

    const updatedTokens = useAuthStore.getState().tokens;

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${updatedTokens.access}`,
        },
    });
};
