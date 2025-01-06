
import React, { useState } from 'react';
import { translateText } from '../../api/translate';
import { useTranslationStore } from '../../store/useStore';
import styles from './TranslationForm.module.scss';
import TranslateIcon from '@mui/icons-material/Translate';
import languagesData from '../../data/languages.json';

const TranslationForm: React.FC = () => {
    const [text, setText] = useState('');
    const [sourceLang, setSourceLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [sourceSelectedByDropdown, setSourceSelectedByDropdown] = useState(false);
    const [targetSelectedByDropdown, setTargetSelectedByDropdown] = useState(false);

    const history = useTranslationStore((state) => state.history);
    const addTranslation = useTranslationStore((state) => state.addTranslation);

    const languages = Object.entries(languagesData).map(([code, name]) => ({
        code,
        name,
    }));

    const handleTranslate = async () => {
        if (!text) {
            alert('Пожалуйста, введите текст для перевода!');
            return;
        }

        if (!sourceLang || !targetLang) {
            alert('Пожалуйста, выберите языки для перевода!');
            return;
        }

        if (sourceLang === targetLang) {
            alert('Исходный и целевой языки не могут быть одинаковыми!');
            return;
        }

        try {
            const result = await translateText(text, targetLang);

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

    const popularSourceLanguages = [
        { code: 'auto', name: 'Автоопределение' },
        { code: 'en', name: 'Английский' },
        { code: 'ru', name: 'Русский' },
    ];

    const popularTargetLanguages = [
        { code: 'en', name: 'Английский' },
        { code: 'ru', name: 'Русский' },
        { code: 'fr', name: 'Французский' },
    ];

    const filteredSourceLanguages = languages.filter(
        (lang) => !popularSourceLanguages.some((popular) => popular.code === lang.code)
    );

    const filteredTargetLanguages = languages.filter(
        (lang) => !popularTargetLanguages.some((popular) => popular.code === lang.code)
    );

    const lastTranslation = history[history.length - 1] || null;

    return (
        <div >
            <button onClick={handleTranslate} className={styles.translateButton}>
                <TranslateIcon />
                Перевести
            </button>
            <div className={styles.homeMainContainer}>
                <div className={styles.firstContainer}>
                    <div className={styles.languageSelection}>
                        <div className={styles.popularLanguages}>
                            {popularSourceLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`${styles.languageButton} ${sourceLang === lang.code ? styles.active : ''}`}
                                    onClick={() => {
                                        setSourceLang(lang.code);
                                        setSourceSelectedByDropdown(false);
                                    }}
                                >
                                    {lang.name}
                                </button>
                            ))}
                            <div className={styles.dropdownWrapper}>
                                <select
                                    value={sourceSelectedByDropdown ? sourceLang : ''}
                                    onChange={(e) => {
                                        setSourceLang(e.target.value);
                                        setSourceSelectedByDropdown(true);
                                    }}
                                    className={`${styles.languageDropdown} ${sourceSelectedByDropdown ? styles.active : ''}`}
                                >
                                    <option value="" disabled>
                                        Другие
                                    </option>
                                    {filteredSourceLanguages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputSection}>
                        <textarea
                            placeholder="Введите текст"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                </div>

                <div className={styles.secondContainer}>
                    <div className={styles.languageSelection}>
                        <div className={styles.popularLanguages}>
                            {popularTargetLanguages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`${styles.languageButton} ${targetLang === lang.code ? styles.active : ''}`}
                                    onClick={() => {
                                        setTargetLang(lang.code);
                                        setTargetSelectedByDropdown(false);
                                    }}
                                >
                                    {lang.name}
                                </button>
                            ))}
                            <div className={styles.dropdownWrapper}>
                                <select
                                    value={targetSelectedByDropdown ? targetLang : ''}
                                    onChange={(e) => {
                                        setTargetLang(e.target.value);
                                        setTargetSelectedByDropdown(true);
                                    }}
                                    className={`${styles.languageDropdown} ${sourceSelectedByDropdown ? styles.active : ''}`}
                                >
                                    <option value="" disabled>
                                        Другие
                                    </option>
                                    {filteredTargetLanguages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>



                    <div className={styles.outputSection}>
                        <div className={styles.translationBox}>
                            {lastTranslation?.translatedText || 'Перевод'}
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default TranslationForm;
