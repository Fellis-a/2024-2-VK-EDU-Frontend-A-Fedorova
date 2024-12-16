import styles from './ChatList.module.scss';
import { Link } from 'react-router-dom';
import { HeaderChatList } from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatsListStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import LazyImage from '../../components/LazyImage';
import SpeakerNotesOffOutlinedIcon from '@mui/icons-material/SpeakerNotesOffOutlined';

const ChatList = () => {

    const { chats, loadChats, createChat, selectChat } = useChatStore();
    const { tokens, currentUser, refreshing, refreshTokens } = useAuthStore();
    const navigate = useNavigate();
    const [chatsLoaded, setChatsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchAndLoadChats = async () => {
            setIsLoading(true);
            if (!tokens?.access && !refreshing) {
                const newTokens = await refreshTokens();
                if (newTokens) {
                    await loadChats(newTokens);
                    setChatsLoaded(true);
                } else {
                    navigate('/login');
                }
            } else if (tokens?.access && !chatsLoaded) {
                await loadChats(tokens);
                setChatsLoaded(true);
            }
            setIsLoading(false);
        };

        fetchAndLoadChats();
    }, [tokens, refreshing, chatsLoaded, loadChats, refreshTokens, navigate]);

    function getInitials(firstName, lastName) {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    }

    if (refreshing || !tokens || isLoading) {
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
                    <div className={styles.noMessages}>
                        <SpeakerNotesOffOutlinedIcon className={styles.noMessagesIcon} />
                        <p className={styles.noMessagesText}>Нет чатов. Создайте новый!</p>
                    </div>
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
                                onClick={() => selectChat(chat.id, { access: tokens.access })}
                                to={`/chat/${chat.id}`}
                            >
                                {avatarUrl ? (
                                    <LazyImage
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
                                        title={`Дата: ${chat.last_message?.created_at ? new Date(chat.last_message.created_at).toISOString().split('T')[0] : 'Неизвестно'}, Время: ${chat.lastMessageTime || ''}`}
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

export default ChatList;