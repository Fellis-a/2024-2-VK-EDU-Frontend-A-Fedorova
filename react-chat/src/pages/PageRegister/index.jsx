import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import styles from './PageRegister.module.scss';
import { toast } from 'react-toastify';

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
            console.log('User registered successfully');
            toast.success('Красавчик, теперь войди в свой аккаунт!');
            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.response) {
                const { data, status } = error.response;

                if (data && typeof data === 'object') {
                    Object.keys(data).forEach((field) => {
                        data[field].forEach((errorMessage) => {
                            toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${errorMessage}`);
                        });
                    });
                }

                switch (status) {
                    case 400:
                        toast.error('Плохой запрос. Попробуйте ещё раз!');
                        break;
                    case 403:
                        toast.error('У вас нет прав для выполнения этой операции!');
                        break;
                    case 404:
                        toast.error('Страница не найдена!');
                        break;
                    case 429:
                        toast.error('Слишком много запросов. Попробуйте позже!');
                        break;
                    case 500:
                        toast.error('Ошибка на сервере. Попробуйте позже!');
                        break;
                    default:
                        toast.error('Что-то пошло не так. Попробуйте снова!');
                }
            } else {
                toast.error('Нет связи с сервером. Попробуйте позже!');
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
