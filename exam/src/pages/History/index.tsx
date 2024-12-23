import React from 'react';
import { useTranslationStore } from '../../store/useStore';
import styles from './History.module.scss';

const History: React.FC = () => {
    const history = useTranslationStore((state) => state.history);
    const clearHistory = useTranslationStore((state) => state.clearHistory);

    return (
        <div>
            <h2>История</h2>
            {history.length === 0 ? (
                <p>Нет переводов</p>
            ) : (
                <div className={styles.historyContainer}>
                    {history.map((item, index) => (
                        <div key={index} className={styles.historyItem}>
                            <p><strong>Текст:</strong> {item.text}</p>
                            <p><strong>Перевод:</strong> {item.translatedText}</p>
                            <p><strong>Язык:</strong> {item.targetLang}</p>
                            <p><strong>Дата:</strong> {new Date(item.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
            <button className={styles.clearHistoryButton} onClick={clearHistory}>Очистить историю</button>
        </div>
    );
};

export default History;
