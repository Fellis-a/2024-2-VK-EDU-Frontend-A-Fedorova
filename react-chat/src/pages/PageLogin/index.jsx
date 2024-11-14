import { useState, useContext } from 'react';
import { loginUser } from '../../api/auth';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './PageLogin.module.scss';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const { setTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tokens = await loginUser(credentials);
            setTokens(tokens);
            console.log('User logged in successfully:', tokens);
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className={styles.authPageContainer}>

            <form onSubmit={handleSubmit} className={styles.authFormContainer}>
                <h2>Чатик 2.0</h2>
                <input
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className={styles.authInput}
                />
                <button type="submit" className={styles.authButton}>Login</button>
            </form>
            <p className={styles.authLink}>
                Не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
}

export default Login;
