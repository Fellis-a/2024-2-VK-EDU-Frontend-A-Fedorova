import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import HistoryIcon from '@mui/icons-material/History';

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.brand}>
                VK Translate
            </Link>
            <Link to="/history" className={styles.history}>
                <HistoryIcon className={styles.icon} />
                <span>История</span>
            </Link>
        </nav>
    );
};

export default Navbar;
