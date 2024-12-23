import React from 'react';
import { useTranslationStore } from '../../store/useStore';

const History: React.FC = () => {
    const history = useTranslationStore((state) => state.history);

    return (
        <div>
            <h2>История</h2>
            {history.length === 0 ? (
                <p>Нет переводов</p>
            ) : (
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>
                            <p>Текст: {item.text}</p>
                            <p>Перевод: {item.translatedText}</p>
                            <p>Язык: {item.targetLang}</p>
                            <p>Дата: {new Date(item.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
