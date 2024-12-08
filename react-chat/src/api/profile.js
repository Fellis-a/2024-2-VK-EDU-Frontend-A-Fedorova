const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (tokens, refreshTokens) => {
    if (!tokens?.access) throw new Error('Access token not available');
    try {
        const response = await fetch(`${BASE_URL}/api/user/current/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokens.access}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        }

        if (response.status === 401) {
            const newTokens = await refreshTokens();
            if (newTokens) {
                return getUserProfile(newTokens, refreshTokens);
            }
        }

        throw new Error('Failed to fetch user profile');
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (uuid, formData, tokens, refreshTokens) => {
    if (!tokens?.access) throw new Error('Access token not available');

    try {
        const response = await fetch(`${BASE_URL}/api/user/${uuid}/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${tokens.access}`,
            },
            body: formData,
        });

        if (response.ok) {
            return await response.json();
        }

        if (response.status === 401) {
            const newTokens = await refreshTokens();
            if (newTokens) {
                return updateUserProfile(uuid, formData, newTokens, refreshTokens);
            }
        }

        const errorDetails = await response.text();
        throw new Error(`Failed to update user profile. ${errorDetails}`);
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};


export const deleteUserAccount = async (uuid, tokens, refreshTokens) => {
    if (!tokens?.access) throw new Error('Access token not available');

    try {
        const response = await fetch(`${BASE_URL}/api/user/${uuid}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${tokens.access}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return { success: true };
        }

        if (response.status === 401) {
            const newTokens = await refreshTokens();
            if (newTokens) {
                return deleteUserAccount(uuid, newTokens, refreshTokens);
            }
        }

        throw new Error('Failed to delete user account');
    } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
    }
};
