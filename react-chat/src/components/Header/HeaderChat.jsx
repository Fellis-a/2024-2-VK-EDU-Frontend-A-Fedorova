import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Header.module.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

const HeaderChat = ({ title, avatarUrl, onDeleteChat }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleDeleteChat = () => {
        if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
            onDeleteChat();
            setMenuOpen(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((word) => word[0]?.toUpperCase())
            .join('');
    };

    return (
        <header className={styles.headerChat}>
            <div className={styles.chatActions}>
                <Link to="/" className={styles.backButton}>
                    <ArrowBackIosNewIcon />
                </Link>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={title} className={styles.chatAvatar} />
                ) : (
                    <div className={styles.initials}>
                        {getInitials(title)}
                    </div>
                )}
                <div className={styles.chatInfo}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    <p className={styles.chatLastSeen}>Был(-а) недавно</p>
                </div>
            </div>
            <div className={styles.chatButtons}>
                <button className={styles.searchButton}>
                    <SearchIcon />
                </button>
                <button className={styles.moreButton} onClick={toggleMenu}>
                    <MoreVertIcon />
                </button>
                {menuOpen && (
                    <ul className={styles.dropdownMenu}>
                        <li>
                            <button onClick={handleDeleteChat} className={styles.deleteButton}>
                                Удалить чат
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

HeaderChat.propTypes = {
    title: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    onDeleteChat: PropTypes.func.isRequired,
};
export default HeaderChat;
