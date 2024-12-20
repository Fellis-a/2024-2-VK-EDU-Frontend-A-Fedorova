import { authFetch } from './auth.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchChats = async (accessToken, search = '', page = 1, pageSize = 100) => {
    try {
        const response = await authFetch(`${BASE_URL}/api/chats/?search=${search}&page=${page}&page_size=${pageSize}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        if (!response.ok) throw new Error('Не удалось загрузить чаты');
        return response.json();
    } catch (error) {
        console.error('Ошибка при получении чатов:', error);
        throw error;
    }
};


export const sendMessageApi = async (chatId, message, voice, files, accessToken) => {
    try {
        if (!accessToken || typeof accessToken !== 'string') {
            console.error('Invalid access token:', accessToken);
            throw new Error('Токен авторизации недействителен.');
        }

        const formData = new FormData();
        formData.append('chat', chatId);

        if (message) formData.append('text', message);

        if (voice) formData.append('voice', voice);
        console.log(voice)

        if (files && files.length > 0) {
            files.forEach(file => {
                formData.append('files', file);
            });
        }

        console.log('Request FormData:', Object.fromEntries(formData.entries()));

        const response = await authFetch(`${BASE_URL}/api/messages/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Не удалось отправить сообщение. Код ошибки: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        throw error;
    }
};



export const createChatApi = async (chatData, accessToken) => {
    try {
        const response = await authFetch(`${BASE_URL}/api/chats/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(chatData),
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            console.error('Ошибка от сервера при создании чата:', errorDetail);

            if (
                Array.isArray(errorDetail) &&
                errorDetail.includes('Private chat with these members already exists')
            ) {
                throw new Error('Чат с этим пользователем уже существует.');
            }

            throw new Error('Не удалось создать чат.');
        }


        return response.json();
    } catch (error) {
        console.error('Ошибка при создании чата:', error);
        throw error;
    }
};

export const fetchMessages = async (chatId, accessToken, page = 1, pageSize = 100) => {
    try {
        const response = await authFetch(
            `${BASE_URL}/api/messages/?chat=${chatId}&page=${page}&page_size=${pageSize}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        if (!response.ok) throw new Error('Не удалось загрузить сообщения');
        return response.json();
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
        throw error;
    }
};


export const deleteChatApi = async (chatId, accessToken) => {
    try {
        const response = await authFetch(`${BASE_URL}/api/chat/${chatId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Не удалось удалить чат');
        }
        return true;
    } catch (error) {
        console.error('Ошибка при удалении чата:', error);
        throw error;
    }
};
