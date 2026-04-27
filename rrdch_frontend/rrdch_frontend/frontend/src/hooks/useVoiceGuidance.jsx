import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../utils/i18n';

export const useVoiceGuidance = () => {
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Voices are loaded asynchronously in some browsers
    const loadVoices = () => {
      setVoices(synth.getVoices());
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    loadVoices();

    return () => {
      synth.cancel(); // Stop speaking when component unmounts
    };
  }, []);

  const speak = useCallback((text) => {
    if (isMuted || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    
    // Cancel any currently playing speech to avoid annoying overlaps
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a voice that matches the current language
    if (language === 'kn') {
      utterance.lang = 'kn-IN';
      const kannadaVoice = voices.find(v => v.lang === 'kn-IN' || v.lang.includes('kn'));
      if (kannadaVoice) {
        utterance.voice = kannadaVoice;
      }
    } else {
      utterance.lang = 'en-IN'; // Default to Indian English for local context
      const englishVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    // Small delay to allow UI to render and feel natural, also helps with browser autoplay policies sometimes
    setTimeout(() => {
      synth.speak(utterance);
    }, 100);
    
  }, [language, isMuted, voices]);

  const toggleMute = () => setIsMuted(prev => !prev);
  const stop = () => window.speechSynthesis && window.speechSynthesis.cancel();

  return { speak, stop, isMuted, toggleMute };
};
