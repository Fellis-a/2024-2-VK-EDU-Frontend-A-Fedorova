import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const savedChats = JSON.parse(localStorage.getItem('chats')) || [];
        setChats(savedChats);

        const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
        setMessages(savedMessages);
    }, []);

    const createChat = (chatName, chatImage) => {
        const chatId = generateUniqueChatId();
        const newChat = {
            chatId,
            name: chatName,
            imageUrl: chatImage,
            lastMessage: 'Начните переписку прямо сейчас!',
            lastMessageTime: '',
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
            time: new Date().toLocaleTimeString(),
        };

        setMessages((prevMessages) => {
            const updatedMessages = {
                ...prevMessages,
                [chatId]: [...(prevMessages[chatId] || []), replyMessage],
            };
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
                if (chat.chatId === chatId) {
                    return {
                        ...chat,
                        lastMessage: replyMessage.text,
                        lastMessageTime: replyMessage.time,
                    };
                }
                return chat;
            });
            localStorage.setItem('chats', JSON.stringify(updatedChats));
            return updatedChats;
        });
    };

    const sendMessage = (chatId, messageText) => {
        const newMessage = { sender: 'Я', text: messageText, time: new Date().toLocaleTimeString() };

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

    return (
        <ChatContext.Provider value={{ chats, selectedChat, selectChat, messages, createChat, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ChatProvider;
