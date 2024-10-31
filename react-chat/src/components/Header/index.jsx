import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.scss';
import BurgerMenu from '../../components/BurgerMenu';

const Header = ({ title, leftElement, centerElement, rightElement }) => {
    const navItems = [
        { label: 'Профиль', link: '/profile' },
        { label: 'Уведомления', link: '/notifications' },
        { label: 'Приватность', link: '/privacy' },
        { label: 'Язык', link: '/language' },
    ];

    const location = useLocation();
    const isMainPage = location.pathname === '/';

    return (
        <header className={styles.headerChat}>
            {isMainPage && <BurgerMenu navItems={navItems} />}
            <div className={styles.chatActions}>
                {leftElement && <div>{leftElement}</div>}
                {centerElement && <div className={styles.centerElement}>{centerElement}</div>}
                <div className={styles.chatInfo}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    {centerElement && <p className={styles.chatLastSeen}>Был(-а) недавно</p>}
                </div>
            </div>
            {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string.isRequired,
    leftElement: PropTypes.element,
    centerElement: PropTypes.element,
    rightElement: PropTypes.element,
};

export default Header;
