import React, { useState } from 'react';
import { translateText } from '../../api/translate';
import { useTranslationStore } from '../../store/useStore';
import styles from './Home.module.scss';

const Home: React.FC = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');
    const addTranslation = useTranslationStore((state) => state.addTranslation);

    const handleTranslate = async () => {
        if (sourceLang === targetLang) {
            alert('Пожалуйста, выберите другой язык перевода! Сейчас исходный и целевой языки совпадают');
            return;
        }

        try {
            const result = await translateText(text, sourceLang, targetLang);
            setTranslatedText(result);

            addTranslation({
                text,
                translatedText: result,
                sourceLang,
                targetLang,
                date: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    return (
        <div className={styles.homeContainer}>

            <div className={styles.translationWrapper}>

                <div className={styles.inputSection}>
                    <div className={styles.languageSelector}>
                        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                            <option value="ru">Russian</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Enter text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className={styles.outputSection}>
                    <div className={styles.languageSelector}>
                        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                            <option value="ru">Russian</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                        </select>
                    </div>
                    <div className={styles.translationBox}>
                        {translatedText || 'Перевод'}
                    </div>
                </div>
            </div>
            <button className={styles.translateButton} onClick={handleTranslate}>
                Translate
            </button>
        </div>
    );
};

export default Home;
