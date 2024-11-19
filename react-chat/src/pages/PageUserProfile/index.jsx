import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../api/profile';
import styles from './PageUserProfile.module.scss';
import { HeaderProfile } from '../../components/Header';


const UserProfile = () => {
    const { tokens, refreshTokens } = useContext(AuthContext);
    const [id, setId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState({});
    const profileImageRef = useRef(null);

    useEffect(() => {
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
            }
        };

        if (tokens) fetchProfile();
    }, [tokens, refreshTokens]);

    const validateFields = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "Это поле обязательно";
        if (!lastName.trim()) newErrors.lastName = "Это поле обязательно";
        if (!username.trim()) newErrors.username = "Это поле обязательно";
        if (firstName.trim().length > 255) newErrors.firstName = `Длина не может превышать 255 символов (сейчас ${firstName.length})`;
        if (lastName.trim().length > 255) newErrors.lastName = `Длина не может превышать 255 символов (сейчас ${lastName.length})`;
        if (username.trim().length > 255) newErrors.username = `Длина не может превышать 255 символов (сейчас ${username.length})`;
        if (!/^[a-zA-Z]+$/.test(username)) newErrors.username = "Username может содержать только латинские буквы";
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
        <div className={styles.userProfile}>
            <HeaderProfile onSave={handleSave} />
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

            {showSuccessMessage && <p className={styles.successMessage}>Профиль успешно сохранён!</p>}
        </div>
    );
};

export default UserProfile;
