import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { fetchChats, sendMessageApi, fetchMessages } from '../api/chats';
import { AuthContext } from './AuthContext';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const { tokens, userId, firstName } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [pollingInterval] = useState(5000);


    useEffect(() => {
        if (selectedChat && messages[selectedChat.id]) {
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    }, [messages, selectedChat]);

    useEffect(() => {
        const savedMessages = localStorage.getItem('messages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        if (tokens?.access) {
            const loadChats = async () => {
                try {
                    const data = await fetchChats(tokens.access);
                    const chatsWithLastMessages = await Promise.all(
                        data.results.map(async (chat) => {
                            const messagesData = await fetchMessages(chat.id, tokens.access);
                            const sortedMessages = (messagesData.results || []).sort(
                                (a, b) => new Date(a.created_at) - new Date(b.created_at)
                            );
                            const lastMessage = sortedMessages[sortedMessages.length - 1];

                            return {
                                ...chat,
                                avatar: chat.avatar || '/default-avatar.png',
                                lastMessage: lastMessage ? lastMessage.text : 'Нет сообщений',
                                lastMessageTime: lastMessage
                                    ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : '',

                            };
                        })
                    );
                    setChats(chatsWithLastMessages);
                } catch (error) {
                    console.error('Failed to load chats:', error);
                    setChats([]);
                } finally {
                    setLoading(false);
                }
            };
            loadChats();
        } else {
            setLoading(false);
        }
    }, [tokens]);



    const selectChat = async (chatId) => {
        const chat = chats.find((chat) => chat.id === chatId);
        if (chat) {
            setSelectedChat(chat);
            try {
                const data = await fetchMessages(chatId, tokens.access);
                const chatMessages = (data.results || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [chatId]: chatMessages.map((msg) => ({
                        senderId: msg.sender.id,
                        senderName: msg.sender.first_name,
                        text: msg.text,
                        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(msg.created_at).toLocaleDateString(),
                        files: msg.files || null,
                        voice: msg.voice || null,
                    })),
                }));

                console.log(chatMessages)
                const lastMessage = chatMessages[chatMessages.length - 1];
                setChats((prevChats) =>
                    prevChats.map((c) =>
                        c.id === chatId
                            ? {
                                ...c,
                                lastMessage: lastMessage ? lastMessage.text : 'Нет сообщений',
                                lastMessageTime: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            }
                            : c
                    )
                );
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        }
    };

    // Периодический polling для обновления сообщений
    useEffect(() => {
        let intervalId;
        if (selectedChat) {
            intervalId = setInterval(async () => {
                try {
                    const chatId = selectedChat.id;
                    const data = await fetchMessages(chatId, tokens.access);
                    const chatMessages = data.results || [];

                    // Сортируем новые сообщения
                    chatMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [chatId]: chatMessages.map((msg) => ({
                            senderId: msg.sender.id,
                            senderName: msg.sender.first_name,
                            text: msg.text,
                            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            date: new Date(msg.created_at).toLocaleDateString(),
                            files: msg.files || null,
                            voice: msg.voice || null,
                        })),
                    }));

                } catch (error) {
                    console.error('Error fetching messages in polling:', error);
                }
            }, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [selectedChat, pollingInterval, tokens]);


    const sendMessage = async (chatId, messageText, files, voice, accessToken) => {
        if (!accessToken) {
            console.error('Токен недействителен');
            return;
        }

        const newMessage = {
            senderId: userId,
            senderName: firstName || 'Вы',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
            files: files ? files.map(file => ({ item: file })) : null,
            voice: voice || null,
            created_at: new Date().toISOString(),
        };

        try {
            await sendMessageApi(chatId, messageText, voice, files, accessToken);

            setMessages((prevMessages) => {
                const updatedMessages = {
                    ...prevMessages,
                    [chatId]: [...(prevMessages[chatId] || []), newMessage],
                };
                localStorage.setItem('messages', JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            setChats((prevChats) =>
                prevChats.map((c) =>
                    c.id === chatId
                        ? {
                            ...c,
                            lastMessage: newMessage.text,
                            lastMessageTime: newMessage.time,
                        }
                        : c
                )
            );
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };





    const createChat = async (chatData) => {
        try {
            const response = await fetch(`${BASE_URL}/api/chats/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens.access}`,
                },
                body: JSON.stringify(chatData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании чата');
            }

            const newChat = await response.json();
            setChats(prevChats => [...prevChats, newChat]); // Добавляем новый чат в состояние
            return newChat;
        } catch (error) {
            console.error('Не удалось создать чат:', error);
            throw error;
        }
    };

    useEffect(() => {
        const savedChatId = localStorage.getItem('selectedChatId');
        if (savedChatId) {
            selectChat(savedChatId);
        }
    }, []);

    useEffect(() => {
        if (selectedChat) {
            localStorage.setItem('selectedChatId', selectedChat.id);
        }
    }, [selectedChat]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat, messages, sendMessage, createChat, selectChat }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatProvider;