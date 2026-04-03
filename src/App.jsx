import { useState } from 'react'
import { Mic, Leaf, SmartphoneNfc, Languages } from 'lucide-react'
import GeminiApiService from './services/geminiService'
import PriceTicker from './components/PriceTicker'
import CameraDiagnosis from './components/CameraDiagnosis'
import { translations } from './utils/languageData'

const aiService = new GeminiApiService()

function App() {
  const [language, setLanguage] = useState('EN')
  const [predictionResult, setPredictionResult] = useState(translations['EN'].analyzePrompt)
  const [isLoading, setIsLoading] = useState(false)

  const t = translations[language]

  // Update default prompt language when toggled, if it hasn't been changed yet
  const handleLanguageToggle = () => {
    const nextLang = language === 'EN' ? 'HI' : language === 'HI' ? 'MR' : 'EN';
    setLanguage(nextLang);
    // Rough heuristic to reset default prompt if user hasn't analyzed anything yet
    if (predictionResult === translations[language].analyzePrompt) {
      setPredictionResult(translations[nextLang].analyzePrompt);
    }
  }

  const fetchPrediction = async () => {
    setIsLoading(true)
    setPredictionResult(t.scanning)

    const result = await aiService.getPredictiveCropProfitability({
      soilType: "Alluvial",
      region: "Maharashtra",
      waterAvailability: "Moderate"
    })

    setPredictionResult(result)
    setIsLoading(false)
  }

  const handleCameraResult = (resultText) => {
    setPredictionResult(resultText);
  }

  return (
    <div className="relative min-h-screen pt-4 pb-6 px-4 overflow-hidden max-w-lg mx-auto md:max-w-3xl">
      {/* Decorative Background Elements */}
      <div 
        aria-hidden="true" 
        className="fixed top-12 -left-12 w-48 h-48 bg-[#39FF14] rounded-full blur-[80px] opacity-20 pointer-events-none"
      ></div>
      <div 
        aria-hidden="true" 
        className="fixed bottom-12 -right-12 w-72 h-72 bg-[#1B5E20] rounded-full blur-[100px] opacity-40 pointer-events-none"
      ></div>

      <header className="relative z-10 pt-2 pb-6 flex items-center justify-between">
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
            aria-label="Profile and Settings"
            className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition"
          >
            <SmartphoneNfc className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Ticker integration above farm intelligence */}
      <PriceTicker translations={t} />

      <main className="relative z-10 flex flex-col gap-6">
        <section aria-labelledby="section-farm-intelligence">
          <h2 id="section-farm-intelligence" className="text-3xl font-extrabold mb-4">
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
              <div className="prose prose-invert prose-p:leading-relaxed max-w-none flex-1 overflow-y-auto">
                {predictionResult.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-label="Quick Actions" className="flex flex-col gap-4">
          <button
            onClick={fetchPrediction}
            disabled={isLoading}
            aria-label={t.analyzeBtn}
            className="w-full bg-[#39FF14] text-[#0D1B11] font-bold text-lg py-4 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.analyzeBtn}
          </button>

          <div className="flex gap-4">
            <div className="flex-1">
              <CameraDiagnosis 
                aiService={aiService} 
                onResult={handleCameraResult} 
                translations={t} 
              />
            </div>
            <button
              aria-label={t.voiceBtn}
              className="flex-1 bg-transparent border-2 border-[#39FF14] text-[#39FF14] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#39FF14]/10 transition"
            >
              <Mic />
              {t.voiceBtn}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
