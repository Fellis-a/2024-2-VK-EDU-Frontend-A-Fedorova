import PropTypes from 'prop-types';
import styles from './ChatItem.module.scss';
import { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../context/ChatProvider';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ChatItem = ({ chat }) => {
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);
    const chatMessages = messages[chat.chatId];
    const messagesEndRef = useRef(null);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(chat.chatId, message);
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

    return (
        <div className={styles.chatItem}>

            <div className={styles.chatMessages}>
                {messages[chat.chatId]?.map((msg, index) => (
                    <div key={index} className={`${styles.message} ${msg.sender === 'Я' ? styles.sent : styles.received}`}>
                        <span className={styles.sender}>{msg.sender}</span> {msg.text}
                        <div className={styles.messageInfo}>
                            <time>{msg.time}</time>
                            <span className={styles.icon}>
                                <DoneAllIcon />
                            </span>
                        </div>
                    </div>
                )) || (
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

ChatItem.propTypes = {
    chat: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
};

export default ChatItem;
