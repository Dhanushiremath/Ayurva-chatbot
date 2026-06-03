import { useState, useRef, useCallback, useEffect } from 'react';

// Language code map: app language → BCP-47 for Web Speech API
const LANG_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
};

/**
 * useVoice — unified Text-to-Speech + Speech-to-Text hook
 *
 * TTS (speak):
 *   speak(text)   → reads the given text aloud using the browser's SpeechSynthesis
 *   stopSpeaking() → stops any ongoing speech
 *   isSpeaking     → boolean
 *
 * STT (listen):
 *   startListening()  → starts mic capture; resolves via onResult callback
 *   stopListening()   → stops mic
 *   isListening       → boolean
 *   transcript        → interim transcript string
 *
 * @param {string} language - app language code ('en', 'hi', etc.)
 * @param {function} onTranscript - called with final transcript string when STT ends
 */
export function useVoice(language = 'en', onTranscript) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [ttsSupported] = useState(() => 'speechSynthesis' in window);
  const [sttSupported] = useState(() =>
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const utteranceRef = useRef(null);
  const recognitionRef = useRef(null);
  const langCode = LANG_MAP[language] || 'en-US';

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  // ── Text-to-Speech ──────────────────────────────────────────────────────────

  /**
   * Strip markdown syntax so TTS reads clean prose.
   */
  const cleanText = (text) => {
    return text
      .replace(/```[\s\S]*?```/g, '') // remove code blocks
      .replace(/`[^`]*`/g, '')        // inline code
      .replace(/#{1,6}\s/g, '')       // headers
      .replace(/[*_~]+/g, '')         // bold / italic / strikethrough markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → link text
      .replace(/^\s*[-*+]\s/gm, '')   // list bullets
      .replace(/^\s*\d+\.\s/gm, '')   // numbered lists
      .replace(/\n{2,}/g, '. ')       // paragraph breaks → pause
      .replace(/\n/g, ' ')
      .trim();
  };

  const speak = useCallback((text) => {
    if (!ttsSupported || !text) return;

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const clean = cleanText(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to pick a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
    if (match) utterance.voice = match;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;

    // Chrome bug: voices load async — slight delay ensures they're ready
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [ttsSupported, langCode]);

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [ttsSupported]);

  // ── Speech-to-Text ──────────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    if (!sttSupported || isListening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(final || interim);

      if (final) {
        onTranscript?.(final.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('[STT] Error:', event.error);
      setIsListening(false);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [sttSupported, isListening, langCode, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsListening(false);
  }, []);

  return {
    // TTS
    speak,
    stopSpeaking,
    isSpeaking,
    ttsSupported,
    // STT
    startListening,
    stopListening,
    isListening,
    transcript,
    sttSupported,
  };
}
