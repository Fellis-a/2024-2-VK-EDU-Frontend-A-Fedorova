import { fetchTranslation } from "./fetch";
import { cacheResult } from "./cache";
import { TranslationOptions } from './types';


export async function translate({
    text,
    fromLanguage,
    toLanguage }: TranslationOptions
): Promise<string> {
    const cacheKey = `${text}-${fromLanguage}-${toLanguage}`;
    console.log(`Checking cache for key: ${cacheKey}`);
    const cachedResult = cacheResult.get(cacheKey);

    if (cachedResult) {
        console.log(`Cache result: ${cachedResult}`);
        return cachedResult;
    }
    console.log(`Cache miss, fetching translation for: ${text}`);
    const translatedText = await fetchTranslation(text, fromLanguage, toLanguage);
    cacheResult.set(cacheKey, translatedText);
    return translatedText;
}
