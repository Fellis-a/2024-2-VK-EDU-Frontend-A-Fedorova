import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';

const HeaderProfile = ({ onSave }) => (
    <header className={styles.headerMain}>
        <Link to="/" className={styles.backButton}>
            <ArrowBackIosNewIcon />
        </Link>
        <h1 className={styles.headerTitleCenter}>Профиль</h1>
        <button onClick={onSave} className={styles.saveButton}><DoneIcon /></button>
    </header>
);

HeaderProfile.propTypes = {
    onSave: PropTypes.func.isRequired,
};

export default HeaderProfile;
