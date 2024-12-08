import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FloatingButton.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUsers } from '../../api/users';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatsListStore';

const FloatingButton = ({ addChat }) => {
    const { tokens } = useAuthStore();
    const userId = useAuthStore.getState().getUserId();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const chatImageRef = useRef(null);
    const { createChat } = useChatStore();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userData = await fetchUsers(tokens.access);
                setUsers(userData.results);
            } catch (error) {
                console.error('Не удалось загрузить пользователей:', error);
            }
        };

        if (tokens?.access) {
            loadUsers();
        }
    }, [tokens]);

    const handleCreateChat = async () => {
        if (!tokens || !tokens.access) {
            console.error('Токены отсутствуют или недействительны');
            alert('Авторизуйтесь заново');
            return;
        }

        if (!selectedUser) {
            alert('Выберите собеседника');
            return;
        }

        if (!userId || !selectedUser?.id) {
            console.error('Некорректные ID участников:', userId, selectedUser?.id);
            alert('Некорректные ID участников');
            return;
        }

        const chatData = {
            members: [selectedUser.id],
            is_private: true,
            title: `Чат с ${selectedUser.username}`,
            created_by: userId,
        };


        try {
            const newChat = await createChat(chatData, tokens);
            addChat(newChat.title, newChat.avatar, [userId, selectedUser.id], true);
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
            alert('Не удалось создать чат');
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button className={styles.floatingButton} onClick={() => setIsModalOpen(true)}>
                <EditIcon />
            </button>
            {isModalOpen && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Создать новый чат</h2>
                        <select
                            className={styles.modalInput}
                            onChange={(e) => setSelectedUser(users.find(user => user.id === e.target.value))}
                            value={selectedUser ? selectedUser.id : ''}
                        >
                            <option value="">Выберите собеседника</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.first_name} {user.last_name})
                                </option>
                            ))}
                        </select>

                        <input
                            type="file"
                            className={styles.modalInput}
                            placeholder="Загрузите картинку собеседника"
                            ref={chatImageRef}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={isPrivate}

                                onChange={() => setIsPrivate(!isPrivate)}
                            />
                            Приватный чат
                        </label>
                        <button className={styles.modalButton} onClick={handleCreateChat}>Создать чат</button>
                    </div>
                </div>
            )}
        </>
    );
};

FloatingButton.propTypes = {
    addChat: PropTypes.func.isRequired,
};

export default FloatingButton;
