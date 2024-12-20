import { IApiResponse } from './types';

const API_URL = "https://api.mymemory.translated.net/get";


export async function fetchTranslation(
    text: string,
    fromLanguage: string,
    toLanguage: string
): Promise<string> {
    const url = `${API_URL}?q=${encodeURIComponent(
        text
    )}&langpair=${fromLanguage}|${toLanguage}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data: IApiResponse = await response.json();

        if (!data.responseData || !data.responseData.translatedText) {
            throw new Error("Invalid API response");
        }

        return data.responseData.translatedText;
    } catch (error) {
        console.error("Error fetching translation", error);
        throw error;
    }
}
