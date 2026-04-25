import React, { useState, useEffect } from 'react';

const VoiceInputButton = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [lang, setLang] = useState('en-US');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      
      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      recog.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      setRecognition(recog);
    }
  }, [onTranscript]);

  const startListening = (l) => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      if (lang === l) return; // Toggle off if same language
    }
    
    setLang(l);
    recognition.lang = l;
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
  };

  if (!recognition) return (
    <div className="text-xs text-neutral-gray italic py-2">
      Voice input is not supported in this browser.
    </div>
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => startListening('en-US')}
          className={`w-full sm:flex-1 flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 border-2 font-black text-[11px] uppercase tracking-[0.1em] shadow-sm ${
            isListening && lang === 'en-US'
              ? 'bg-primary-blue border-primary-blue text-white animate-pulse shadow-primary-blue/30 scale-[1.02]'
              : 'bg-white border-border-soft text-secondary-blue hover:border-primary-blue/50 hover:bg-primary-blue/5'
          }`}
        >
          <span className="text-xl">🎤</span>
          <span>Speak English</span>
        </button>
        
        <button
          type="button"
          onClick={() => startListening('kn-IN')}
          className={`w-full sm:flex-1 flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 border-2 font-black text-[11px] uppercase tracking-[0.1em] shadow-sm ${
            isListening && lang === 'kn-IN'
              ? 'bg-success-green border-success-green text-white animate-pulse shadow-success-green/30 scale-[1.02]'
              : 'bg-white border-border-soft text-secondary-blue hover:border-success-green/50 hover:bg-success-green/5'
          }`}
        >
          <span className="text-xl">🎤</span>
          <span>ಮಾತನಾಡಿ (Kannada)</span>
        </button>
      </div>
      
      {isListening && (
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 bg-primary-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <div className="w-1.5 h-1.5 bg-primary-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-1.5 h-1.5 bg-primary-blue rounded-full animate-bounce"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary-blue">
            Listening in {lang === 'en-US' ? 'English' : 'Kannada'}...
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;
