import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

class GeminiApiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY, { apiVersion: 'v1' });

    // Hardened Safety Settings for SDG-compliant agricultural advice
    this.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ];

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      safetySettings: this.safetySettings,
    });
  }

  /**
   * Helper method to add a timeout to any promise, addressing rural connectivity needs.
   */
  async _withTimeout(promise, timeoutMs = 30000) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Network timeout. Please check your connection and try again.'));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Analyzes farm parameters for profitability forecasting with Contextual Integrity.
   */
  async getPredictiveCropProfitability({ soilType, region, waterAvailability, language = 'EN' }) {
    // 1. Variable Enforcement: Validation check
    if (!region) {
      return 'Error: Region selection is mandatory for localized analysis.';
    }

    // 2. Dynamic System Prompting
    const regionalModel = this.genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      safetySettings: this.safetySettings,
      systemInstruction: `You are an Agentic Chief Operating Officer (COO) strictly focused on the ${region} region. 
      CRITICAL: You MUST generate the entire report in the ${language} language. Use professional agricultural terminology appropriate for the ${region} region in that specific language. 
      Your knowledge base and recommendations must be 100% specific to ${region}. You are prohibited from using default data from Maharashtra or other states unless they are explicitly the subject of the query.`,
    });

    const headers = {
      EN: {
        rec: '### 📈 Strategic Recommendation',
        fin: '### 💰 Financial Outlook & ROI',
        sdg: '### 🌍 SDG Impact & Mitigation',
      },
      HI: {
        rec: '### 📈 सामरिक अनुशंसा',
        fin: '### 💰 वित्तीय दृष्टिकोण',
        sdg: '### 🌍 SDG प्रभाव और शमन',
      },
      MR: {
        rec: '### 📈 धोरणात्मक शिफारस',
        fin: '### 💰 आर्थिक दृष्टिकोन',
        sdg: '### 🌍 SDG प्रभाव आणि शमन',
      },
    };

    const h = headers[language] || headers.EN;

    // 2. Strict Prompt Engineering with Cultural Intelligence
    const prompt = `
      CRITICAL INSTRUCTION: You must ONLY analyze the region provided in the parameters: ${region}. Do NOT reference Maharashtra or any other state unless explicitly provided. If the region is ${region}, suggest crops and Mandi insights specific to ${region}'s unique agro-climatic conditions (e.g., Rice/Kiwi for Arunachal, Wheat for Punjab).

      LANGUAGE INSTRUCTION: Generate the entire report in ${language}.
      
      CULTURAL INTELLIGENCE: Reference local crop names and measurement units relevant to ${language} and ${region} (e.g., 'Bigha' or 'Guntha' instead of 'Hectare' if applicable to the region).

      Analyze the following parameters to recommend the most profitable crop to sow for the upcoming season in ${region}:
      
      Integrate real-time insights for ${region}, including:
      - Current Mandi (market) prices for major commodities in ${region}.
      - Typical soil health profiles and water table data for ${region}.
      - SDG 1 (No Poverty) and SDG 2 (Zero Hunger) impact metrics.
      
      Parameters:
      - Region: ${region}
      - Soil Type: ${soilType}
      - Water Availability: ${waterAvailability}
      
      Structure your response exactly with these Markdown headers in ${language}:
      ${h.rec}
      (Detailed analysis of the best crop to sow based on ${region}'s specific parameters)

      ${h.fin}
      (Projected costs, expected market prices in ${region} Mandis, and ROI margin analysis)

      ${h.sdg}
      (How this crop supports SDG 1 & 2 in ${region}, and any climate mitigation steps needed)
      
      Use professional Markdown formatting with bold text and bullet points. Ensure high-end consultative language.
    `;

    try {
      const result = await this._withTimeout(regionalModel.generateContent(prompt), 30000);
      return result.response.text() || 'Error: No response generated.';
    } catch (e) {
      if (e.message.includes('Network timeout')) {
        return e.message;
      }
      if (e.status === 404 || (e.message && e.message.includes('404'))) {
        return 'Error 404: API endpoint not found. Please check your API key permissions and ensure you are using the v1 Production Gateway.';
      }
      return `Error analyzing profitability: ${e.message}`;
    }
  }

  /**
   * Handles conversational AI voice queries (transcription text passed in).
   */
  async askCoPilot(transcribedQuestion, language = 'EN', region = 'Maharashtra') {
    const conversationalModel = this.genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      safetySettings: this.safetySettings,
      systemInstruction: `You are an expert agricultural consultant for Indian farmers in ${region}. You are receiving a voice-transcribed query in ${language}. 
      CRITICAL: You MUST respond in the ${language} language. Keep your response short, conversational, and direct, focused on immediate agricultural action. Avoid long preambles.`,
    });

    const prompt = `QUERY: ${transcribedQuestion}`;

    try {
      const result = await this._withTimeout(conversationalModel.generateContent(prompt), 30000);
      return result.response.text() || 'I could not process that request.';
    } catch (e) {
      if (e.message.includes('Network timeout')) {
        return 'Voice analysis timed out. Your connection might be slow.';
      }
      return 'Connection error. Please try again.';
    }
  }

  /**
   * Multimodal SDG 2.3: Analyzes a photo of a crop with regional guardrails.
   */
  async diagnoseCropHealth(base64Image, region, mimeType = 'image/jpeg') {
    // 3. Multimodal Guardrails: Regional compliance check
    const regionalModel = this.genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      safetySettings: this.safetySettings,
      systemInstruction: `You are an expert agronomist providing pest remediation advice compliant with the specific agricultural regulations and local environmental laws of ${region}, India.`,
    });

    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const prompt = `Analyze this crop image for a farm in ${region}. Identify any visible diseases, pests, or nutrient deficiencies. Provide 3 immediate, low-cost remedial actions that are strictly compliant with agricultural regulations in ${region}.`;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    try {
      const result = await this._withTimeout(
        regionalModel.generateContent([prompt, imagePart]),
        45000
      );
      return result.response.text() || 'Could not analyze the image.';
    } catch (e) {
      if (e.message.includes('Network timeout')) {
        return 'Image diagnosis timed out. Your connection might be slow.';
      }
      if (e.status === 404 || (e.message && e.message.includes('404'))) {
        return 'Error 404: API endpoint not found. Please check your API key permissions and ensure you are using the v1 Production Gateway.';
      }
      return `Diagnosis error: ${e.message}`;
    }
  }
}

export default GeminiApiService;
