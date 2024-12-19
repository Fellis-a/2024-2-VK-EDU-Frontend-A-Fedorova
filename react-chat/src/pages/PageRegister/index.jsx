import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import styles from './PageRegister.module.scss';
import { toast } from 'react-toastify';
import { translate } from '../../../ts/utils/translate';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        bio: ''
    });
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await registerUser({ ...formData, avatar });

            toast.success('Красавчик, теперь войди в свой аккаунт!');
            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);

            if (error.details && typeof error.details === 'object') {
                if (error.details.detail) {
                    const translatedMessage = await translate({ text: error.details.detail, fromLanguage: 'en', toLanguage: 'ru' });
                    toast.error(translatedMessage);
                } else {
                    Object.entries(error.details).forEach(async ([field, messages]) => {
                        if (Array.isArray(messages)) {
                            for (const message of messages) {
                                const translatedMessage = await translate({ text: message, fromLanguage: 'en', toLanguage: 'ru' });
                                toast.error(`${field}: ${translatedMessage}`);
                            }
                        } else {
                            const translatedMessage = await translate({ text: messages, fromLanguage: 'en', toLanguage: 'ru' });
                            toast.error(`${field}: ${translatedMessage}`);
                        }
                    });
                }
            } else if (error.details) {
                const translatedMessage = await translate(error.details, 'en', 'ru');
                toast.error(translatedMessage);
            } else {
                toast.error('Ошибка регистрации! Попробуйте еще раз.');
            }
        }
    };


    return (
        <div className={styles.authPageContainer}>
            <form onSubmit={handleSubmit} className={styles.authFormContainer}>
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <input
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <input
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <input
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className={styles.authInput}
                />
                <div className={styles.fileInputContainer}>
                    <label htmlFor="avatar" className={styles.fileInputLabel}>
                        Choose File
                    </label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.hiddenFileInput}
                    />
                </div>
                <button type="submit" className={styles.authButton}>Register</button>
            </form>
        </div>
    );
}

export default Register;
