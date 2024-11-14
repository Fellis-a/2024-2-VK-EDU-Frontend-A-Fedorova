import PropTypes from 'prop-types';
import styles from './ChatList.module.scss';
import { Link } from 'react-router-dom';
import useChats from '../../context/useChats';
import { HeaderChatList } from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import useAuth from '../../context/useAuth';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ onChatSelect }) => {
    const { chats, createChat } = useChats();
    const { currentUser } = useAuth();
    const chatArray = Array.isArray(chats) ? chats : [];
    const { tokens } = useContext(AuthContext); // Получаем токены
    const navigate = useNavigate();

    useEffect(() => {
        if (!tokens?.access) {
            navigate('/login');
        }
    }, [tokens, navigate]);

    return (
        <div className={styles.pageChatList}>
            <HeaderChatList />
            <ul className={styles.chatList}>
                {chatArray.length === 0 ? (
                    <li className={styles.noChatsMessage}>Нет чатов. Создайте новый чат!</li>
                ) : (
                    chatArray.map(chat => {
                        const isPrivateChat = chat.is_private;
                        let chatName = chat.title;

                        if (isPrivateChat && chat.members && currentUser) {
                            const otherMember = chat.members.find(
                                member => member.id !== currentUser.id
                            );
                            chatName = otherMember ? otherMember.first_name : 'Неизвестный';
                        }

                        const avatarUrl = chat.avatar;

                        return (
                            <Link
                                className={styles.chatItem}
                                key={chat.id}
                                onClick={() => onChatSelect(chat.id)}
                                to={`/chat/${chat.id}`}
                            >
                                <img className={styles.chatAvatar} src={avatarUrl} alt={chatName} />
                                <div className={styles.chatDetails}>
                                    <span className={styles.chatTitle}>{chatName}</span>
                                    <p className={styles.chatLastMessage}>
                                        {chat.lastMessage || 'Нет сообщений'}
                                    </p>
                                </div>
                                <div className={styles.chatTime}>
                                    <span
                                        title={`Дата: ${chat.lastMessageDate || 'Неизвестно'}, Время: ${chat.lastMessageTime || ''}`}
                                    >
                                        {chat.lastMessageTime || ''}
                                    </span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </ul>

            <FloatingButton addChat={createChat} />
        </div>
    );
};

ChatList.propTypes = {
    onChatSelect: PropTypes.func.isRequired,
};

export default ChatList;
