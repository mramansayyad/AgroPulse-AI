import { describe, it, expect, vi, beforeEach } from 'vitest';
import GeminiApiService from '../services/geminiService';

// Mock environment variables
vi.stubEnv('VITE_GEMINI_API_KEY', 'test_key');

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function () {
      this.getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Mocked AI response',
          },
        }),
      });
    }),
    HarmCategory: {
      HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
      HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
      HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    },
    HarmBlockThreshold: {
      BLOCK_LOW_AND_ABOVE: 'BLOCK_LOW_AND_ABOVE',
      BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  };
});

describe('GeminiApiService', () => {
  let service;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GeminiApiService();
  });

  it('initializes the Gemini model', () => {
    expect(service).toBeDefined();
    expect(service.genAI).toBeDefined();
  });

  it('getPredictiveCropProfitability returns a valid response', async () => {
    const result = await service.getPredictiveCropProfitability({
      soilType: 'Alluvial',
      region: 'Maharashtra',
      waterAvailability: 'High',
      language: 'EN',
    });
    expect(result).toBe('Mocked AI response');
  });

  it('diagnoseCropHealth returns a valid response', async () => {
    const result = await service.diagnoseCropHealth('base64data', 'Maharashtra');
    expect(result).toBe('Mocked AI response');
  });
});
