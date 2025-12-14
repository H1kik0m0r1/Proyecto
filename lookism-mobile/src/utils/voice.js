import * as Speech from 'expo-speech';

export const speak = (text) => {
    Speech.speak(text, {
        language: 'es-ES',
        rate: 0.9,
        pitch: 1.0,
    });
};

export const stop = () => {
    Speech.stop();
};
