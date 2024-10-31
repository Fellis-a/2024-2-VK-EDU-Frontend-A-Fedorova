import { useState, useRef, useEffect } from 'react';
import styles from './PageUserProfile.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const UserProfile = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');
    const [lastName, setLastName] = useState(localStorage.getItem('lastName') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [bio, setBio] = useState(localStorage.getItem('bio') || '');
    const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || 'https://cs13.pikabu.ru/post_img/2023/10/28/2/1698456437194820220.jpg');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({});
    const profileImageRef = useRef(null);

    const validateFields = () => {
        const newErrors = {};
        if (!firstName) newErrors.firstName = "Это поле обязательно";
        if (!lastName) newErrors.lastName = "Это поле обязательно";
        if (!username) newErrors.username = "Это поле обязательно";
        if (firstName.length > 255) newErrors.firstName = `Длина не может превышать 255 символов (сейчас ${firstName.length})`;
        if (lastName.length > 255) newErrors.lastName = `Длина не может превышать 255 символов (сейчас ${lastName.length})`;
        if (username.length > 255) newErrors.username = `Длина не может превышать 255 символов (сейчас ${username.length})`;
        if (!/^[a-zA-Z]+$/.test(username)) newErrors.username = "Username может содержать только латинские буквы";
        return newErrors;
    };

    const handleSave = () => {
        const validationErrors = validateFields();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('username', username);
            localStorage.setItem('bio', bio);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            navigate('/');
        }
    };

    const handleImageChange = () => {
        const newImageUrl = profileImageRef.current.value;
        if (newImageUrl) {
            setProfileImage(newImageUrl);
            localStorage.setItem('profileImage', newImageUrl);
            setIsModalOpen(false);
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
        <div className={styles.userProfile}>
            <Header
                title="Профиль"
                leftElement={<button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ArrowBackIosNewIcon />
                </button>}
                rightElement={<button onClick={handleSave} className={styles.saveButton}><DoneIcon /></button>}
            />
            <div className={styles.profileContent}>
                <div className={styles.profileImage} onClick={() => setIsModalOpen(true)}>
                    <img src={profileImage} alt="Profile" />
                    <div className={styles.cameraIcon}><ModeEditIcon /></div>
                </div>

                <label className={styles.label} htmlFor="firstName">Имя <span className={styles.required}>*</span></label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Введите имя"
                    className={styles.textField}
                />
                {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

                <label className={styles.label} htmlFor="lastName">Фамилия <span className={styles.required}>*</span></label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Введите фамилию"
                    className={styles.textField}
                />
                {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

                <label className={styles.label} htmlFor="username">Username <span className={styles.required}>*</span></label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введите username"
                    className={styles.textField}
                />
                {errors.username && <p className={styles.error}>{errors.username}</p>}

                <label className={styles.label} htmlFor="bio">О себе</label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Расскажите о себе"
                    className={styles.textArea}
                />
            </div>

            {isModalOpen && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Изменить фото профиля</h2>
                        <input
                            type="text"
                            placeholder="URL нового фото"
                            ref={profileImageRef}
                            className={styles.modalInput}
                        />
                        <button className={styles.modalButton} onClick={handleImageChange}>Сохранить</button>
                        <button className={styles.modalCancelButton} onClick={() => setIsModalOpen(false)}>Отмена</button>
                    </div>
                </div>
            )}

            {showSuccessMessage && <p className={styles.successMessage}>Профиль успешно сохранён!</p>}
        </div>
    );
};

export default UserProfile;
