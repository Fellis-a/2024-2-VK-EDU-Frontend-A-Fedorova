import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import BurgerMenu from '../../components/BurgerMenu';

import SearchIcon from '@mui/icons-material/Search';

const HeaderChatList = () => {
    const navItems = [
        { label: 'Профиль', link: '/profile' },
        { label: 'Уведомления', link: '/notifications' },
        { label: 'Приватность', link: '/404' },
        { label: 'Язык', link: '/404' },

    ];

    return (
        <header className={styles.headerChatList}>
            <BurgerMenu navItems={navItems} className={styles.burgerButton} />
            <h1 className={styles.headerTitleCenter}>Чаты</h1>
            <button className={styles.searchButton} >
                <SearchIcon />
            </button>
        </header>
    );
};

HeaderChatList.propTypes = {
    title: PropTypes.string,
};

export default HeaderChatList;
