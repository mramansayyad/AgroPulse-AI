import React, { useState, useCallback, useEffect } from 'react';
import { Mic, Leaf, SmartphoneNfc, Languages, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GeminiApiService from './services/geminiService';
import PriceTicker from './components/PriceTicker';
import CameraDiagnosis from './components/CameraDiagnosis';
import Auth from './components/Auth';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { translations } from './utils/languageData';

const aiService = new GeminiApiService();

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [language, setLanguage] = useState('EN');
  const [selectedRegion, setSelectedRegion] = useState('Maharashtra');
  const [predictionResult, setPredictionResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setPredictionResult(
          translations[language].auth.onboardingWelcome.replace(
            '{name}',
            currentUser.displayName.split(' ')[0]
          )
        );
      }
    });
    return () => unsubscribe();
  }, [language]);

  const t = translations[language];

  const handleLanguageToggle = useCallback(() => {
    const nextLang = language === 'EN' ? 'HI' : language === 'HI' ? 'MR' : 'EN';
    setLanguage(nextLang);
  }, [language]);

  const fetchPrediction = useCallback(async () => {
    setIsLoading(true);
    setPredictionResult(t.scanning);

    const result = await aiService.getPredictiveCropProfitability({
      soilType: 'Alluvial',
      region: selectedRegion,
      waterAvailability: 'Moderate',
      language: language,
    });

    setPredictionResult(result);
    setIsLoading(false);
  }, [t.scanning, selectedRegion, language]);

  useEffect(() => {
    if (user && predictionResult.includes('Welcome')) {
      setPredictionResult(
        translations[language].auth.onboardingWelcome.replace(
          '{name}',
          user.displayName.split(' ')[0]
        )
      );
    }
    document.documentElement.lang = language.toLowerCase();
  }, [selectedRegion, language, user]);

  const handleCameraResult = useCallback((resultText) => {
    setPredictionResult(resultText);
  }, []);

  const [isListening, setIsListening] = useState(false);

  const handleVoiceConsultation = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.errors?.speechNotSupported || 'Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'HI' ? 'hi-IN' : language === 'MR' ? 'mr-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsLoading(true);
      setPredictionResult(t.scanning);

      try {
        const response = await aiService.askCoPilot(transcript, language, selectedRegion);
        setPredictionResult(response);
      } catch (err) {
        setPredictionResult(t.errors?.voiceFail || 'Consultation failed. Try again.');
      } finally {
        setIsLoading(false);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert(t.errors?.micDenied || 'Microphone access denied. Please enable permissions.');
      } else {
        console.error('Voice recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Recognition start error:', err);
      setIsListening(false);
    }
  }, [language, selectedRegion, t]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#39FF14]/20 border-t-[#39FF14] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth language={language} onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="relative min-h-screen pt-4 pb-6 px-4 overflow-hidden max-w-lg mx-auto md:max-w-3xl slide-in">
      {/* Decorative Background Elements */}
      <div
        aria-hidden="true"
        className="fixed top-12 -left-12 w-48 h-48 bg-[#39FF14] rounded-full blur-[80px] opacity-20 pointer-events-none"
      ></div>
      <div
        aria-hidden="true"
        className="fixed bottom-12 -right-12 w-72 h-72 bg-[#1B5E20] rounded-full blur-[100px] opacity-40 pointer-events-none"
      ></div>

      <header className="relative z-10 pt-2 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Leaf className="text-[#39FF14]" />
            {t.appTitle}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleLanguageToggle}
              aria-label="Toggle Language"
              className="p-2 rounded-full border border-white/10 flex items-center gap-2 bg-white/5 hover:bg-white/10 transition text-sm font-bold"
            >
              <Languages className="w-5 h-5 text-[#39FF14]" />
              {language}
            </button>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition flex items-center gap-2 text-gray-300"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-6 h-6 rounded-full border border-[#39FF14]/50"
                />
              ) : (
                <SmartphoneNfc className="w-5 h-5" />
              )}
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Geolocation Dropdown */}
        <div className="w-full px-1">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            aria-label="Select your agricultural region"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 outline-none focus:border-[#39FF14]/50 transition appearance-none cursor-pointer glass-card"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2339FF14' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.25rem',
            }}
          >
            {Object.entries(translations['EN'].regions).map(([key, enName]) => (
              <option key={key} value={enName} className="bg-[#0D1B11]">
                {t.regions[key]}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Ticker integration above farm intelligence */}
      <PriceTicker translations={t} />

      <main className="relative z-10 flex flex-col gap-6">
        <section aria-labelledby="section-farm-intelligence" className="flex flex-col gap-4">
          <h2 id="section-farm-intelligence" className="text-3xl font-extrabold mb-2">
            {t.farmIntelligence}
          </h2>

          <div
            className="glass-card p-6 min-h-[300px] flex flex-col relative"
            aria-live="polite"
            aria-busy={isLoading}
            aria-atomic="true"
            role="status"
            aria-label="Analysis Results Card"
          >
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-[#39FF14]/20 border-t-[#39FF14] rounded-full animate-spin"></div>
                <p className="text-[#39FF14] animate-pulse font-medium">{t.scanning}</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-p:leading-relaxed max-w-none flex-1 overflow-y-auto custom-markdown">
                <ReactMarkdown>{predictionResult}</ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        <section aria-label="Quick Actions" className="flex flex-col gap-4">
          <button
            onClick={fetchPrediction}
            disabled={isLoading}
            className="w-full bg-[#39FF14] text-[#0D1B11] font-bold text-lg py-4 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition active:scale-95 disabled:opacity-50"
          >
            Analyze Season Profitability for {selectedRegion}
          </button>

          <div className="flex flex-col gap-4">
            <CameraDiagnosis
              aiService={aiService}
              onResult={handleCameraResult}
              translations={t}
              selectedRegion={selectedRegion}
            />
            <button
              onClick={handleVoiceConsultation}
              disabled={isLoading || isListening}
              aria-label={t.voiceBtn}
              className={`w-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] font-bold text-lg py-5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#39FF14]/10 transition active:scale-95 ${isListening ? 'pulse-animation' : ''}`}
            >
              <Mic className={isListening ? 'animate-bounce' : ''} />
              {isListening ? t.listening : t.voiceBtn}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
