import PropTypes from 'prop-types';
import styles from './ChatList.module.scss';
import { Link } from 'react-router-dom';
import { HeaderChatList } from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatsListStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const ChatList = ({ onChatSelect }) => {

    const { chats, loadChats, createChat } = useChatStore();
    const { tokens, currentUser, refreshing, refreshTokens } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!tokens?.access) {
            if (!refreshing) {
                refreshTokens().then((newTokens) => {
                    if (newTokens) {
                        loadChats(newTokens);
                    } else {
                        navigate('/login');
                    }
                });
            }
        } else {
            loadChats(tokens);
        }
    }, [tokens, refreshing, loadChats, navigate, refreshTokens]);

    function getInitials(firstName, lastName) {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    }

    if (refreshing || !tokens || chats.length === 0) {
        return (
            <div className={styles.loaderContainer}>
                <Loader size="50px" color="var(--color-sent-message)" />
            </div>
        );
    }


    return (
        <div className={styles.pageChatList}>
            <HeaderChatList />
            <ul className={styles.chatList}>
                {chats.length === 0 ? (
                    <li className={styles.noChatsMessage}>Нет чатов. Создайте новый чат!</li>
                ) : (
                    chats.map(chat => {
                        const isPrivateChat = chat.is_private;
                        let chatName = chat.title;
                        let firstName = '';
                        let lastName = '';


                        if (isPrivateChat && chat.members && currentUser) {
                            const otherMember = chat.members.find(
                                member => member.id !== currentUser.id
                            );
                            chatName = otherMember ? otherMember.first_name : 'Неизвестный';
                            firstName = otherMember?.first_name || '';
                            lastName = otherMember?.last_name || '';
                        }

                        const avatarUrl = chat.avatar;
                        const initials = getInitials(firstName, lastName);

                        return (
                            <Link
                                className={styles.chatItem}
                                key={chat.id}
                                onClick={() => onChatSelect(chat.id)}
                                to={`/chat/${chat.id}`}
                            >
                                {avatarUrl ? (
                                    <img
                                        className={styles.chatAvatar}
                                        src={avatarUrl}
                                        alt={`Аватар пользователя ${chatName}`}
                                    />
                                ) : (
                                    <div className={styles.chatAvatarFallback}>
                                        {initials || chatName.charAt(0).toUpperCase()}
                                    </div>
                                )}
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
