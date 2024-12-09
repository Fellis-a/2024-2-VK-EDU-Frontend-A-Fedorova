import PropTypes from 'prop-types';
import styles from './Loader.module.scss';

const Loader = ({ size = 'medium', color = '#000' }) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader} style={{ width: size, height: size, borderColor: `${color} transparent` }} />
        </div>
    );
};

Loader.propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
};

export default Loader;
