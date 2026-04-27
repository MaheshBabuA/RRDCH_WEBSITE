import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../utils/i18n';

// 13-Language Map extracted from MedOS AI
const LANG_MAP = {
  en: "en-US", 
  kn: "kn-IN", // Added specifically for RRDCH
  hi: "hi-IN", 
  es: "es-ES", 
  zh: "zh-CN", 
  ar: "ar-SA",
  bn: "bn-BD", 
  fr: "fr-FR", 
  ru: "ru-RU", 
  ja: "ja-JP",
  de: "de-DE", 
  ko: "ko-KR", 
  te: "te-IN", // Telugu for regional support
  ta: "ta-IN"  // Tamil for regional support
};

const VoiceInputButton = ({ onTranscript, className = '', targetLanguage, onListeningEnd }) => {
  const { language: globalLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Determine active language code
  const activeLangKey = targetLanguage || globalLanguage;
  const activeLangCode = LANG_MAP[activeLangKey] || "en-US";

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = activeLangCode;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (onListeningEnd) onListeningEnd();
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (onListeningEnd) onListeningEnd();
    };
    recognition.onresult = (event) => {
      let currentTranscript = '';
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      if (currentTranscript) onTranscript(currentTranscript, isFinal);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }, [isListening, activeLangCode, onTranscript]);

  if (!isSupported) return (
    <div className="text-[10px] text-neutral-gray italic py-1 opacity-50">
      Voice not supported
    </div>
  );

  const isKannada = activeLangKey === 'kn';

  return (
    <div className={`voice-input-container flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`flex items-center justify-center p-4 rounded-full transition-all duration-300 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] ${
          isListening
            ? 'bg-red-500 text-white shadow-[inset_4px_4px_10px_#cc0000,inset_-4px_-4px_10px_#ff4d4d] animate-pulse'
            : 'bg-gray-50 text-primary-blue'
        }`}
        title={isListening ? "Stop Listening" : `Speak in ${activeLangCode}`}
      >
        <span className="text-2xl">{isListening ? '⏹' : '🎤'}</span>
      </button>
      
      {isListening && (
        <div className="mt-4 flex items-center justify-center gap-1 h-6">
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite] h-full"></div>
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.1s] h-3/4"></div>
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.2s] h-full"></div>
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.3s] h-1/2"></div>
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.4s] h-3/4"></div>
          <div className="w-1.5 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.5s] h-full"></div>
          <style>{`
            @keyframes wave {
              0%, 100% { transform: scaleY(0.4); }
              50% { transform: scaleY(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
