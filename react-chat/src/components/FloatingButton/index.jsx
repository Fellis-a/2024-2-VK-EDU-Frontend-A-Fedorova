import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FloatingButton.module.scss';
import EditIcon from '@mui/icons-material/Edit';

const FloatingButton = ({ addChat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chatNameRef = useRef(null);
    const chatImageRef = useRef(null);

    const handleCreateChat = () => {
        const chatName = chatNameRef.current.value;
        const chatImage = chatImageRef.current ? chatImageRef.current.value : 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg';

        if (chatName) {
            addChat(chatName, chatImage || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg');
            setIsModalOpen(false);
            chatNameRef.current.value = '';
            chatImageRef.current.value = '';
        } else {
            alert('Чат не был создан. Имя собеседника не указано.');
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isModalOpen]);

    return (
        <>
            <button className={styles.floatingButton} onClick={() => setIsModalOpen(true)}>
                <EditIcon />
            </button>
            {isModalOpen && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Создать новый чат</h2>
                        <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="Имя собеседника"
                            ref={chatNameRef}
                        />
                        <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="URL картинки собеседника"
                            ref={chatImageRef}
                        />
                        <button className={styles.modalButton} onClick={handleCreateChat}>
                            Создать
                        </button>
                        <button className={styles.modalCancelButton} onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </button>
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
