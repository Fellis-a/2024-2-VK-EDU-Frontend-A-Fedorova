import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FloatingButton.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import { fetchAllUsers } from '../../api/users';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatsListStore';
import { toast } from 'react-toastify';

const FloatingButton = ({ addChat }) => {
    const { tokens } = useAuthStore();
    const userId = useAuthStore.getState().getUserId();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const chatImageRef = useRef(null);
    const { createChat, chats } = useChatStore();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const allUsers = await fetchAllUsers(tokens.access);
                setUsers(allUsers);
                setFilteredUsers(allUsers);
                setError(null);
            } catch (err) {
                console.error('Ошибка при загрузке пользователей:', err);
                setError('Не удалось загрузить пользователей');
            } finally {
                setLoading(false);
            }
        };

        if (tokens?.access) {
            loadUsers();
        }
    }, [tokens, chats]);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchQuery) ||
            user.first_name.toLowerCase().includes(searchQuery) ||
            user.last_name.toLowerCase().includes(searchQuery)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

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
            setSearchQuery('');
        } catch (error) {
            if (error.message === 'Чат с этим пользователем уже существует.') {
                toast.warning('Чат с этим пользователем уже существует.');
            } else {
                toast.error('Не удалось создать чат. Попробуйте позже.');
            }
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button className={styles.floatingButton} aria-label="Создать новый чат" onClick={() => setIsModalOpen(true)}>
                <EditIcon />
            </button>
            {isModalOpen && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Создать новый чат</h2>
                        {/* <select
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
                        </select> */}

                        <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="Введите имя пользователя"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {loading && <div>Загрузка...</div>}
                        {error && <div className={styles.error}>{error}</div>}
                        <div className={styles.userList}>
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selectedUser : ''}`}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    {user.username} ({user.first_name} {user.last_name})
                                </div>
                            ))}
                        </div>
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
