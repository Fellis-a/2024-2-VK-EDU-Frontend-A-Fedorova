import TranslateUtils from './index';

async function testTranslate() {
    try {
        const translated = await TranslateUtils.translate({
            text: 'Hello',
            fromLanguage: 'en',
            toLanguage: 'fr',
        }
        );
        console.log('Translated text:', translated);
    } catch (error) {
        console.error('Error during translation:', error);
    }
}

testTranslate();
