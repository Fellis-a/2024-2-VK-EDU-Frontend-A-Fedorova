import React from 'react';
import { useTranslationStore } from '../../store/useStore';
import styles from './History.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import languagesDataRaw from '../../data/languages.json';

interface HistoryProps {
    onClose: () => void;

    isHistoryOpen: boolean;
}

const languagesData: Record<string, string> = languagesDataRaw;

const History: React.FC<HistoryProps> = ({ onClose, isHistoryOpen }) => {
    const history = useTranslationStore((state) => state.history);
    const clearHistory = useTranslationStore((state) => state.clearHistory);

    const getLanguageName = (code: string): string => {
        if (languagesData[code]) return languagesData[code];

        const matchingCode = Object.keys(languagesData).find((key) =>
            key.startsWith(`${code}-`)
        );

        return matchingCode ? languagesData[matchingCode] : code;
    };

    return (
        <div className={`${styles.historyOverlay} ${styles.historyOverlay} ${isHistoryOpen ? styles.open : ''
            }`}>
            <div className={styles.historyContainer}>
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </button>
                <h2>История</h2>

                <button className={styles.clearHistoryButton} onClick={clearHistory}>Очистить историю</button>
                {history.length === 0 ? (
                    <p>Нет переводов</p>
                ) : (<div>
                    {history.map((item, index) => (
                        <div key={index} className={styles.historyItem}>
                            <p>
                                <strong>{getLanguageName(item.sourceLang)}</strong> →{' '}
                                <strong>{getLanguageName(item.targetLang)}</strong>
                            </p>
                            <p>{item.text}</p>
                            <p><em>{item.translatedText}</em></p>
                            <p>{new Date(item.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default History;
