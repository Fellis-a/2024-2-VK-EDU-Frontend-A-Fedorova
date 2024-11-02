import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

const HeaderChat = ({ title, avatarUrl }) => {


    return (
        <header className={styles.headerChat}>
            <div className={styles.chatActions}>
                <Link to="/" className={styles.backButton}>
                    <ArrowBackIosNewIcon />
                </Link>
                <img src={avatarUrl} alt={title} className={styles.chatAvatar} />
                <div className={styles.chatInfo}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    <p className={styles.chatLastSeen}>Был(-а) недавно</p>
                </div>
            </div>
            <div className={styles.chatButtons}>
                <button className={styles.searchButton}>
                    <SearchIcon />
                </button>
                <button className={styles.moreButton}>
                    <MoreVertIcon />
                </button>
            </div>
        </header>
    );
};

HeaderChat.propTypes = {
    title: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
};

export default HeaderChat;
