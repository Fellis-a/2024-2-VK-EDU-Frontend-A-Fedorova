import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const NotificationsManager = ({ currentChatId, chats, userId }) => {
    const notifiedMessageIds = useRef(new Set());

    const getChatPartner = (chat, userId) => {
        if (!chat || !chat.members) return null;
        return chat.members.find(member => member.id !== userId);
    };

    useEffect(() => {
        if (!chats || chats.length === 0) return;

        chats.forEach((chat) => {
            if (!chat.lastMessage || chat.id === currentChatId) return;

            const chatPartner = getChatPartner(chat, userId);
            const chatTitle = chat.is_private && chatPartner
                ? `${chatPartner.first_name} ${chatPartner.last_name || ''}`
                : chat.title || 'Новое сообщение';
            console.log(chatTitle);
            const lastMessage = chat.lastMessage;
            console.log(lastMessage);
            const lastMessageId = lastMessage.id;
            console.log(lastMessageId);
            if (
                lastMessage &&
                !notifiedMessageIds.current.has(lastMessageId) &&
                lastMessage.senderId !== userId
            ) {
                toast.info(`Сообщение от ${chatTitle}: ${lastMessage.text || '[Вложение]'}`);
                notifiedMessageIds.current.add(lastMessageId);
            }
        });
    }, [chats, currentChatId, userId]);

    return null;
};

NotificationsManager.propTypes = {
    currentChatId: PropTypes.string,
    chats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            members: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    username: PropTypes.string.isRequired,
                    first_name: PropTypes.string.isRequired,
                    last_name: PropTypes.string,
                    avatar: PropTypes.string,
                })
            ).isRequired,
            creator: PropTypes.shape({
                id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
            }).isRequired,
            title: PropTypes.string,
            is_private: PropTypes.bool.isRequired,
        })
    ).isRequired,
    userId: PropTypes.string.isRequired,
};

export default NotificationsManager;
