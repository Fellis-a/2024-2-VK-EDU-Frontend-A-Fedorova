import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { fetchChats, sendMessageApi, createChatApi, fetchMessages } from '../api/chats';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const { tokens, userId } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [pollingInterval] = useState(5000);


    useEffect(() => {
        if (tokens?.access) {
            const loadChats = async () => {
                try {
                    const data = await fetchChats(tokens.access);
                    const chatsWithLastMessages = await Promise.all(
                        data.results.map(async (chat) => {
                            const messagesData = await fetchMessages(chat.id, tokens.access);
                            const lastMessage = messagesData.results[messagesData.results.length - 1];

                            return {
                                ...chat,
                                lastMessage: lastMessage ? lastMessage.text : 'Нет сообщений',
                                lastMessageTime: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
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
                        })),
                    }));
                } catch (error) {
                    console.error('Error fetching messages in polling:', error);
                }
            }, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [selectedChat, pollingInterval, tokens]);


    const sendMessage = async (chatId, messageText) => {
        const newMessage = {
            senderId: userId,
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
        };

        try {
            await sendMessageApi(chatId, messageText, tokens.access);
            setMessages((prevMessages) => ({
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), newMessage],
            }));

            setChats((prevChats) =>
                prevChats.map((c) =>
                    c.id === chatId
                        ? {
                            ...c,
                            lastMessage: messageText,
                            lastMessageTime: newMessage.time,
                        }
                        : c
                )
            );
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };


    const createChat = async (chatName, chatImage, membersList, isPrivate) => {
        try {
            const newChat = await createChatApi(
                {
                    title: chatName,
                    description: isPrivate ? 'Private chat' : 'Group chat',
                    avatar: chatImage,
                    members: membersList,
                    is_private: isPrivate,
                },
                tokens.access
            );

            setChats((prevChats) => [...(Array.isArray(prevChats) ? prevChats : []), newChat]);
        } catch (error) {
            console.error('Failed to create chat:', error);
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
