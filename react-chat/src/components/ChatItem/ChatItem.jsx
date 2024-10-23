import PropTypes from 'prop-types';
import styles from './ChatItem.module.scss';
import { useState, useContext } from 'react';
import { ChatContext } from '../../context/ChatProvider';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ChatItem = ({ chat }) => {
    const [message, setMessage] = useState('');
    const { sendMessage, messages } = useContext(ChatContext);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(chat.chatId, message);
            setMessage('');
        }
    };

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
                )) || <p>Нет сообщений</p>}
            </div>

            <div className={styles.chatInputForm}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
