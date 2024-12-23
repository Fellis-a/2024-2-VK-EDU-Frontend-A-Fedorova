import { create } from 'zustand';

interface Translation {
    text: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    date: string;
}

interface TranslationStore {
    history: Translation[];
    addTranslation: (translation: Translation) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
    history: JSON.parse(localStorage.getItem('translationHistory') || '[]'),
    addTranslation: (translation) => {
        set((state) => {
            const updatedHistory = [...state.history, translation];
            localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
            return { history: updatedHistory };
        });
    },
}));
