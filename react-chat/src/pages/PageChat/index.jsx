import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatProvider';
import { AuthContext } from '../../context/AuthContext';
import styles from './ChatItem.module.scss';
import useChats from '../../context/useChats';
import { HeaderChat } from '../../components/Header';

import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ChatItem = () => {
    const { chatId } = useParams();
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { chats } = useChats();

    const currentChat = chats.find((chat) => chat.id === chatId);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(chatId, message);
            setMessage('');

            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 0);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    useEffect(() => {
        const savedChatId = localStorage.getItem('selectedChatId');
        if (savedChatId && (!chatId || savedChatId !== chatId)) {
            navigate(`/chat/${savedChatId}`);
        }
    }, [chatId, navigate]);

    return (
        <div className={styles.chatItem}>
            <HeaderChat
                title={currentChat ? currentChat.title : 'Чат'}
                imageUrl={currentChat ? currentChat.imageUrl : ''}
            />
            <div className={styles.chatMessages}>
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => {
                        const isSent = msg.senderId === userId;
                        return (
                            <div
                                key={index}
                                className={
                                    isSent
                                        ? `${styles.message} ${styles.sent}`
                                        : `${styles.message} ${styles.received}`
                                }
                            >
                                <span className={styles.sender}>{msg.senderName}</span>
                                <p className={styles.messageText}>{msg.text}</p>
                                <div className={styles.messageInfo}>
                                    <span
                                        title={`Дата: ${msg.date}, Время: ${msg.time}`}
                                        className={styles.messageTime}
                                    >
                                        {msg.time}
                                    </span>
                                    <span className={styles.icon}>
                                        <DoneAllIcon className={isSent ? styles.sentIcon : styles.receivedIcon} />
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.noMessages}>
                        <ChatBubbleOutlineIcon className={styles.noMessagesIcon} />
                        <p className={styles.noMessagesText}>Нет сообщений</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <footer className={styles.chatInputForm}>
                <input
                    className={styles.chatInput}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button className={styles.chatBtnSend} onClick={handleSendMessage}>
                    <ArrowUpwardIcon />
                </button>
            </footer>
        </div>
    );
};

export default ChatItem;
