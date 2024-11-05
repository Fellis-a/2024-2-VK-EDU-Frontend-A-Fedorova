import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './BurgerMenu.module.scss';

const BurgerMenu = ({ navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        document.body.classList.toggle('body-fixated', !isOpen);
    };

    const handleNavClick = (link) => {
        navigate(link);
        toggleMenu();
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
