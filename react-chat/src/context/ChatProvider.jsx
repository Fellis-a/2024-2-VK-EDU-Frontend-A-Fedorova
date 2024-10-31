import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem('chats')) || [];
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};

        setChats(savedChats);
        setMessages(savedMessages);

        if (savedChats.length > 0) {
            const updatedChats = savedChats.map(chat => {
                const lastMessage = savedMessages[chat.chatId]?.slice(-1)[0];
                return lastMessage
                    ? {
                        ...chat,
                        lastMessage: lastMessage.text,
                        lastMessageTime: lastMessage.time,
                        lastMessageDate: lastMessage.date,
                    }
                    : chat;
            });
            setChats(updatedChats);
        }
    }, []);

    useEffect(() => {
        setChats((prevChats) => prevChats.map(chat => {
            const lastMessage = messages[chat.chatId]?.slice(-1)[0];
            return lastMessage
                ? {
                    ...chat,
                    lastMessage: lastMessage.text,
                    lastMessageTime: lastMessage.time,
                    lastMessageDate: lastMessage.date,
                }
                : chat;
        }));
    }, [messages]);


    const createChat = (chatName, chatImage) => {
        const chatId = generateUniqueChatId();
        const newChat = {
            chatId,
            name: chatName,
            imageUrl: chatImage,
            lastMessage: 'Начните переписку прямо сейчас!',
            lastMessageTime: '',
            lastMessageDate: '',
        };

        setChats((prevChats) => {
            const updatedChats = [...prevChats, newChat];
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            return updatedChats;
        });
    };

    const generateUniqueChatId = () => {
        let chatId;
        do {
            chatId = Math.floor(Math.random() * 1000000);
        } while (chats.some(chat => chat.chatId === chatId));
        return chatId;
    };

    const selectChat = (chatId) => {
        const chat = chats.find((chat) => chat.chatId === chatId);
        setSelectedChat(chat);
    };

    const autoReply = (chatId) => {
        const replies = [
            "Привет!",
            "Расскажи мне что-нибудь интересное!",
            "Как твой день?",
            "Отлично, продолжай!",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMessage = {
            sender: 'Собеседник',
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
        };

        updateChatMessages(chatId, replyMessage);
    };

    const sendMessage = (chatId, messageText) => {
        const firstName = localStorage.getItem('firstName') || 'Имя';
        const lastName = localStorage.getItem('lastName') || 'Фамилия';
        const senderName = `${firstName} ${lastName}`;

        const newMessage = {
            sender: senderName,
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
        };

        setMessages((prevMessages) => {
            const updatedMessages = {
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), newMessage],
            };
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
                if (chat.chatId === chatId) {
                    return {
                        ...chat,
                        lastMessage: newMessage.text,
                        lastMessageTime: newMessage.time,
                        lastMessageDate: newMessage.date,
                    };
                }
                return chat;
            });
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            return updatedChats;
        });

        setTimeout(() => {
            autoReply(chatId);
        }, 2000);
    };

    const updateChatMessages = (chatId, message) => {
        setMessages((prevMessages) => {
            const updatedMessages = {
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), message],
            };
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
                if (chat.chatId === chatId) {
                    return {
                        ...chat,
                        lastMessage: message.text,
                        lastMessageTime: message.time,
                        lastMessageDate: message.date,
                    };
                }
                return chat;
            });
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            return updatedChats;
        });
    };


    return (
        <ChatContext.Provider value={{
            chats,
            selectedChat,
            setSelectedChat,
            selectChat,
            messages,
            createChat,
            sendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatProvider;
