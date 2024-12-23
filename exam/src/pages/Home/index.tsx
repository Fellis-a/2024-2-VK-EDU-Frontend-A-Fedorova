import React, { useState } from 'react';
import { translateText } from '../../api/translate';
import { useTranslationStore } from '../../store/useStore';
import styles from './Home.module.scss';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const Home: React.FC = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLang, setTargetLang] = useState('es');
    const addTranslation = useTranslationStore((state) => state.addTranslation);

    const handleTranslate = async () => {
        if (!text) {
            alert('Пожалуйста, введите текст для перевода!');
            return;
        }

        try {
            const result = await translateText(text, targetLang);
            setTranslatedText(result);

            addTranslation({
                text,
                translatedText: result,
                sourceLang: 'auto',
                targetLang,
                date: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.controls}>
                <div className={styles.languageSelectorFrom}>
                    <select >
                        <option value="auto">Auto</option>
                    </select>
                </div>
                <button className={styles.translateButton} onClick={handleTranslate}>
                    <SyncAltIcon />
                </button>
                <div className={styles.languageSelectorTo}>
                    <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                        <option value="ru">Russian</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                    </select>
                </div>
            </div>

            <div className={styles.translationWrapper}>

                <div className={styles.inputSection}>

                    <textarea
                        placeholder="Enter text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className={styles.outputSection}>

                    <div className={styles.translationBox}>
                        {translatedText || 'Перевод'}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
