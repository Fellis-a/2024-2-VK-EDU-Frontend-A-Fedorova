import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './LazyImage.module.scss';

const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: '0px', threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) observer.unobserve(imgRef.current);
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isLoaded ? src : ''}
            alt={alt}
            className={`${className} ${styles.lazyImage} ${isLoaded ? styles.loaded : ''}`}
            loading="lazy"
        />
    );
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default LazyImage;
