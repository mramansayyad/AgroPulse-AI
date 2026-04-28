import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock the GeminiApiService
vi.mock('../services/geminiService', () => {
  return {
    default: class MockGeminiApiService {
      async getPredictiveCropProfitability() {
        return 'Mocked prediction result.';
      }
      async diagnoseCropHealth() {
        return 'Mocked diagnosis result.';
      }
    },
  };
});

// Mock environment variables to prevent testing errors related to GenAI initialization
vi.stubEnv('VITE_GEMINI_API_KEY', 'test_key');

describe('App Component', () => {
  it('renders the main app title', () => {
    render(<App />);
    expect(screen.getByText(/AgroPulse AI/i)).toBeInTheDocument();
  });

  it('toggles language when language button is clicked', () => {
    render(<App />);
    const langBtn = screen.getByLabelText(/Toggle Language/i);
    expect(langBtn).toHaveTextContent('EN');
    fireEvent.click(langBtn);
    expect(langBtn).toHaveTextContent('HI');
    fireEvent.click(langBtn);
    expect(langBtn).toHaveTextContent('MR');
  });

  it('displays the PriceTicker component', () => {
    render(<App />);
    expect(screen.getByLabelText(/Live Mandi Price Volatility Ticker/i)).toBeInTheDocument();
  });
});
