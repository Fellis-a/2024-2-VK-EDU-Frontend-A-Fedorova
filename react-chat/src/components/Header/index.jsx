import PropTypes from 'prop-types';
import styles from './Header.module.scss';
// import { useState, useEffect } from 'react';

const Header = ({ title, leftElement, centerElement, rightElement }) => {
    // const [menuActive, setMenuActive] = useState(false);

    // const toggleMenu = () => {
    //     setMenuActive(!menuActive);
    // };

    // useEffect(() => {
    //     if (menuActive) {
    //         document.body.classList.add(styles.bodyFixated);
    //     } else {
    //         document.body.classList.remove(styles.bodyFixated);
    //     }
    // }, [menuActive]);

    return (
        <header className={styles.headerChat}>
            {/* <div className={`${styles.hamburger} ${menuActive ? styles.active : ''}`} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div> */}
            <div className={styles.chatActions}>
                {leftElement && <div >{leftElement}</div>}

                {centerElement && <div className={styles.centerElement}>{centerElement}</div>}
                <div className={styles.chatInfo}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    {centerElement && <p className={styles.chatLastSeen}
                    >Был(-а) недавно</p>}

                </div></div>

            <div> {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
            </div>

            {/* <nav className={`${styles.headerNav} ${menuActive ? styles.active : ''}`}>
                <div className={styles.headerNavTitle}>
                    <h1>Настройки</h1>
                </div>
                <a href="#" className={styles.headerNavItem}>Профиль</a>
                <a href="#" className={styles.headerNavItem}>Уведомления</a>
                <a href="#" className={styles.headerNavItem}>Приватность</a>
                <a href="#" className={styles.headerNavItem}>Язык</a>
            </nav> */}
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    leftElement: PropTypes.element,
    centerElement: PropTypes.element,
    rightElement: PropTypes.element
};

export default Header;
