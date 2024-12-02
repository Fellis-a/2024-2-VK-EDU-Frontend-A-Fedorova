import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';
import { AuthContext } from '../../context/AuthContext';

const BurgerMenu = ({ navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { setTokens, setCurrentUser } = useContext(AuthContext);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        document.body.classList.toggle('body-fixated', !isOpen);
    };

    const handleNavClick = (link) => {
        navigate(link);
        toggleMenu();
    };

    const handleLogout = () => {
        localStorage.removeItem('tokens');
        setTokens(null);
        setCurrentUser(null);
        toggleMenu();
        navigate('/login');
    };

    return (
        <div className={styles.burgerMenuContainer}>
            <div
                className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                style={{ zIndex: 3 }}
            >
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div>

            <nav className={`${styles.headerNav} ${isOpen ? styles.active : ''}`}>
                <div className={styles.headerNavTitle}>
                    <h1>Настройки</h1>
                </div>
                {navItems.map((item, index) => (
                    <div
                        key={index}
                        className={styles.headerNavItem}
                        onClick={() => handleNavClick(item.link)}
                    >
                        {item.label}
                    </div>
                ))}
                <div
                    className={`${styles.headerNavItem} ${styles.logout}`}
                    onClick={handleLogout}
                >
                    Выйти
                </div>
            </nav>
        </div>
    );
};

BurgerMenu.propTypes = {
    navItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default BurgerMenu;
