import { useState, useEffect, useRef } from 'react';

import { getUserProfile, updateUserProfile } from '../../api/profile';
import styles from './PageUserProfile.module.scss';
import { HeaderProfile } from '../../components/Header';
import { deleteUserAccount } from '../../api/profile';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';



const UserProfile = () => {
    const { refreshTokens } = useAuthStore();
    const { tokens, setTokens } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({});
    const profileImageRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile(tokens, refreshTokens);
                setId(profile.id);
                setFirstName(profile.first_name);
                setLastName(profile.last_name);
                setUsername(profile.username);
                setBio(profile.bio || '');
                setProfileImage(profile.avatar || '');
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (tokens) fetchProfile();
    }, [tokens, refreshTokens]);

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
            try {
                await deleteUserAccount(id, tokens, refreshTokens);
                alert('Ваш аккаунт был успешно удалён. Вы будете перенаправлены на главную страницу.');
                setTokens(null);
                localStorage.removeItem('tokens');
                navigate('/login');
            } catch (error) {
                console.error('Ошибка при удалении аккаунта:', error);
                alert('Произошла ошибка при удалении аккаунта. Попробуйте ещё раз позже.');
            }
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "Это поле обязательно";
        if (!lastName.trim()) newErrors.lastName = "Это поле обязательно";
        if (!username.trim()) newErrors.username = "Это поле обязательно";
        if (firstName.trim().length > 255) newErrors.firstName = `Длина не может превышать 255 символов (сейчас ${firstName.length})`;
        if (lastName.trim().length > 255) newErrors.lastName = `Длина не может превышать 255 символов (сейчас ${lastName.length})`;
        if (username.trim().length > 255) newErrors.username = `Длина не может превышать 255 символов (сейчас ${username.length})`;
        // if (!/^[a-zA-Z]+$/.test(username)) newErrors.username = "Username может содержать только латинские буквы";
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validateFields();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0 && id) {
            try {
                const formData = new FormData();
                formData.append('first_name', firstName.trim());
                formData.append('last_name', lastName.trim());
                formData.append('username', username.trim());
                formData.append('bio', bio);
                if (profileImage instanceof File) {
                    formData.append('avatar', profileImage);
                }

                const result = await updateUserProfile(id, formData, tokens, refreshTokens);
                console.log('Результат сохранения:', result);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } catch (error) {
                console.error('Ошибка сохранения:', error.response || error.message || error);
            }
        }
    };

    const handleInputChange = (setter, fieldName) => (e) => {
        setter(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    return (
        <div className={styles.profile}>
            {isLoading ? (
                <Loader size="50px" color="#007BFF" />
            ) : (<>
                <HeaderProfile onSave={handleSave} />
                <div className={styles.userProfile}>
                    {showSuccessMessage && <p className={styles.successMessage}>Профиль успешно сохранён!</p>}
                    <div className={styles.profileContent}>
                        <div className={styles.profileImage}>
                            <img
                                src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                                alt="Profile"
                            />
                            <div className={styles.fileInputContainer}>
                                <label htmlFor="profileImage" className={styles.fileInputLabel}>
                                    Choose File
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    ref={profileImageRef}
                                    onChange={handleFileChange}
                                    className={styles.fileInput}
                                />


                            </div>
                        </div>

                        <label className={styles.label} htmlFor="firstName">Имя <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={handleInputChange(setFirstName, "firstName")}
                            placeholder="Введите имя"
                            className={styles.textField}
                        />
                        <p className={`${styles.error} ${errors.firstName ? '' : styles.hidden}`}>
                            {errors.firstName || " "}
                        </p>

                        <label className={styles.label} htmlFor="lastName">Фамилия <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={handleInputChange(setLastName, "lastName")}
                            placeholder="Введите фамилию"
                            className={styles.textField}
                        />
                        <p className={`${styles.error} ${errors.lastName ? '' : styles.hidden}`}>
                            {errors.lastName || " "}
                        </p>

                        <label className={styles.label} htmlFor="username">Username <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleInputChange(setUsername, "username")}
                            placeholder="Введите username"
                            className={styles.textField}
                        />
                        <p className={`${styles.error} ${errors.username ? '' : styles.hidden}`}>
                            {errors.username || " "}
                        </p>

                        <label className={styles.label} htmlFor="bio">О себе</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Расскажите о себе"
                            className={styles.textArea}
                        />
                    </div>
                    <div className={styles.deleteAccount}>
                        <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                            Удалить аккаунт
                        </button>
                    </div>
                </div>
            </>
            )}
        </div>
    );
};

export default UserProfile;
