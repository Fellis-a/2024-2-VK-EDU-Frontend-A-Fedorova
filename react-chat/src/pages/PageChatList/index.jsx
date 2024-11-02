import { useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatList.module.scss';
import { Link } from 'react-router-dom';
import { ChatContext } from '../../context/ChatProvider';
import { HeaderChatList } from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';

const ChatList = ({ onChatSelect, createChat }) => {
    const { chats } = useContext(ChatContext);

    return (
        <div className={styles.pageChatList}>
            <HeaderChatList />
            <ul className={styles.chatList}>
                {chats.map(chat => (
                    <Link
                        className={styles.chatItem}
                        key={chat.chatId}
                        onClick={() => onChatSelect(chat.chatId)}
                        to={`/chat/${chat.chatId}`}
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
                    </Link>
                ))}
            </ul>

            <FloatingButton addChat={createChat} />
        </div>
    );
};

ChatList.propTypes = {
    onChatSelect: PropTypes.func.isRequired,
    createChat: PropTypes.func.isRequired,
};

export default ChatList;
