import React, { useState } from 'react';
import styles from './Home.module.scss';
import TranslationForm from '../../components/TranslationForm';
import History from '../History';
import HistoryIcon from '@mui/icons-material/History';

const Home: React.FC = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };

    return (
        <div className={styles.homeContainer}>


            <TranslationForm />
            <button onClick={toggleHistory} className={styles.history}>
                <div className={styles.historyIcon}>
                    <HistoryIcon className={styles.icon} />
                </div>

                <span>История</span>
            </button>

            {isHistoryOpen && <History onClose={toggleHistory} isHistoryOpen={isHistoryOpen} />}
        </div>
    );
};

export default Home;