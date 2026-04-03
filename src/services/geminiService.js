import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiApiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Helper method to add a timeout to any promise, addressing rural connectivity needs.
   */
  async _withTimeout(promise, timeoutMs = 15000) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Network timeout. Please check your connection and try again."));
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
   * Analyzes farm parameters for profitability forecasting.
   */
  async getPredictiveCropProfitability({ soilType, region, waterAvailability }) {
    const prompt = `
      You are an Agentic Chief Operating Officer (COO) for an Indian smallholder farmer.
      Analyze the following parameters to recommend the most profitable crop to sow for the upcoming season,
      along with an estimated ROI margin. Focus on SDG 1 (No Poverty) and SDG 2 (Zero Hunger).
      
      Parameters:
      - Region: ${region}
      - Soil Type: ${soilType}
      - Water Availability: ${waterAvailability}
      
      Provide a concise 3-paragraph consultative report.
    `;

    try {
      const result = await this._withTimeout(this.model.generateContent(prompt), 15000);
      return result.response.text() || "Error: No response generated.";
    } catch (e) {
      if (e.message.includes("Network timeout")) {
        return e.message;
      }
      return `Error analyzing profitability: ${e.message}`;
    }
  }

  /**
   * Handles conversational AI voice queries (transcription text passed in).
   */
  async askCoPilot(transcribedQuestion) {
    const prompt = `As an agricultural expert for Indian smallholders, answer: ${transcribedQuestion}`;
    
    try {
      const result = await this._withTimeout(this.model.generateContent(prompt), 15000);
      return result.response.text() || "I could not process that request.";
    } catch (e) {
      if (e.message.includes("Network timeout")) {
        return "Voice analysis timed out. Your connection might be slow.";
      }
      return "Connection error. Please try again.";
    }
  }

  /**
   * Multimodal SDG 2.3: Analyzes a photo of a crop to diagnose health/disease.
   */
  async diagnoseCropHealth(base64Image, mimeType = "image/jpeg") {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    
    const prompt = "You are an expert agronomist for Indian smallholder farmers. Analyze this crop image. Identify any visible diseases, pests, or nutrient deficiencies, and provide 3 immediate, low-cost remedial actions to save the crop.";
    
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType
      }
    };

    try {
      const result = await this._withTimeout(this.model.generateContent([prompt, imagePart]), 20000);
      return result.response.text() || "Could not analyze the image.";
    } catch (e) {
      if (e.message.includes("Network timeout")) {
        return "Image diagnosis timed out. Your connection might be slow.";
      }
      return `Diagnosis error: ${e.message}`;
    }
  }
}

export default GeminiApiService;
