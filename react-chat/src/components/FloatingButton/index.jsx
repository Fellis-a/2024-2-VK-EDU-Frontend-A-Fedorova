import { useState, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FloatingButton.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../../context/AuthContext';
import { fetchUsers } from '../../api/users';

const FloatingButton = ({ addChat }) => {
    const { tokens, userId } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrivate, setIsPrivate] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const chatImageRef = useRef(null);
    const [setSelectedChat] = useState(null);

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
        if (!selectedUser) {
            alert('Выберите собеседника');
            return;
        }

        if (!userId || !selectedUser?.id) {
            console.error('Некорректные ID участников:', userId, selectedUser?.id);
            alert('Некорректные ID участников');
            return;
        }

        try {
            const existingChatsResponse = await fetch(`http://localhost:8080/api/chats/?members=${userId},${selectedUser.id}`, {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });

            if (!existingChatsResponse.ok) {
                throw new Error('Не удалось проверить существующие чаты');
            }

            const existingChats = await existingChatsResponse.json();

            const privateChatExists = existingChats.results.some(chat => chat.is_private);

            if (privateChatExists) {
                alert('Приватный чат с этими участниками уже существует');
                setSelectedChat(existingChats.results.find(chat => chat.is_private));
                setIsModalOpen(false);
                setSelectedUser(null);
                return;
            }

            const chatData = {
                members: [selectedUser.id],
                is_private: true,
                title: `Чат с ${selectedUser.username}`,
                created_by: userId,
            };

            console.log('Creating chat with members:', chatData.members);

            const response = await fetch('http://localhost:8080/api/chats/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens.access}`,
                },
                body: JSON.stringify(chatData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка при создании чата:', errorData);
                throw new Error(errorData.detail || 'Не удалось создать чат');
            }

            const newChat = await response.json();
            addChat(newChat.title, newChat.avatar, [userId, selectedUser.id], true);
            setSelectedChat(newChat);
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
