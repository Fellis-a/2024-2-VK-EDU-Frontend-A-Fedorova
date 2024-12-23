export const translateText = async (text: string, targetLang: string): Promise<string> => {
    const baseUrl = 'https://api.mymemory.translated.net/get';
    const url = `${baseUrl}?q=${encodeURIComponent(text)}&langpair=Autodetect|${encodeURIComponent(targetLang)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to translate text');
        }

        const data = await response.json();

        return data.responseData.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};
