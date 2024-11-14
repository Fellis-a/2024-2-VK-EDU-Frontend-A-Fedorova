const API_BASE_URL = 'https://vkedu-fullstack-div2.ru';

export const getUserProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
