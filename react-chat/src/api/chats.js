const API_BASE_URL = 'http://localhost:8080';

export const fetchChats = async (accessToken, search = '', page = 1, pageSize = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chats/?search=${search}&page=${page}&page_size=${pageSize}`, {
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

export const sendMessageApi = async (chatId, message, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ text: message, chat: chatId }),
        });
        if (!response.ok) throw new Error(`Не удалось отправить сообщение. Код ошибки: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        throw error;
    }
};



export const createChatApi = async (chatData, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chats/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(chatData),
        });
        if (!response.ok) throw new Error('Не удалось создать чат');
        return response.json();
    } catch (error) {
        console.error('Ошибка при создании чата:', error);
        throw error;
    }
};

export const fetchMessages = async (chatId, accessToken, page = 1, pageSize = 20) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/messages/?chat=${chatId}&page=${page}&page_size=${pageSize}`,
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


