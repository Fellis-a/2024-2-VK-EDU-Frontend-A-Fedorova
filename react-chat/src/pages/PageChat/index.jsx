import { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatProvider';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import styles from './ChatItem.module.scss';

const ChatItem = () => {
    const { chatId } = useParams();
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);
    const chatMessages = messages[chatId] || [];
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(chatId, message);
            setMessage('');
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
            <div className={styles.chatMessages}>
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${msg.sender === 'Собеседник' ? styles.received : styles.sent}`}
                        >
                            <span className={styles.sender}>{msg.sender}</span>
                            <p className={styles.messageText}>{msg.text}</p>
                            <div className={styles.messageInfo}>
                                <span
                                    title={`Дата: ${msg.date}, Время: ${msg.time}`}
                                    className={styles.messageTime}
                                >
                                    {msg.time}
                                </span>
                                <span className={styles.icon}>
                                    <DoneAllIcon className={msg.sender === 'Собеседник' ? styles.receivedIcon : styles.sentIcon} />
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noMessages}>
                        <ChatBubbleOutlineIcon className={styles.noMessagesIcon} />
                        <p className={styles.noMessagesText}>Нет сообщений</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.chatInputForm}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                    className={styles.chatInput}
                />
                <button onClick={handleSendMessage} className={styles.chatBtnSend}>
                    <ArrowUpwardIcon />
                </button>
            </div>
        </div>
    );
};

export default ChatItem;
