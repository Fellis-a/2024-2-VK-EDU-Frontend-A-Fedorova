import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './ChatList.module.scss';
import { ChatContext } from '../../context/ChatProvider';

const ChatList = ({ onChatSelect }) => {
    const { chats } = useContext(ChatContext);
    const navigate = useNavigate();

    const handleChatSelect = (chatId) => {
        onChatSelect(chatId);
        navigate(`/chat/${chatId}`);
    };

    return (
        <ul className={styles.chatList}>
            {chats.map(chat => (
                <li
                    className={styles.chatItem}
                    key={chat.chatId}
                    onClick={() => handleChatSelect(chat.chatId)}
                >
                    <img className={styles.chatAvatar} src={chat.imageUrl} alt={chat.name} />
                    <div className={styles.chatDetails}>
                        <span className={styles.chatTitle}>{chat.name}</span>
                        <p className={styles.chatLastMessage}>{chat.lastMessage}</p>
                    </div>
                    <div className={styles.chatTime}>
                        <span
                            title={`Дата: ${chat.lastMessageDate}, Время: ${chat.lastMessageTime}`}
                        >
                            {chat.lastMessageTime}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};

ChatList.propTypes = {
    onChatSelect: PropTypes.func.isRequired,
};

export default ChatList;
