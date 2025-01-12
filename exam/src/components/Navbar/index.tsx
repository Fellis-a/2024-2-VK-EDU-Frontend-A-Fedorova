import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.brand}>
                VK Translate
            </Link>

        </nav>
    );
};

export default Navbar;
