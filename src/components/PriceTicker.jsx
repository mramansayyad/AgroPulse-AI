import React, { useState, useEffect } from 'react';

const PriceTicker = ({ translations }) => {
  const [prices, setPrices] = useState([
    { id: 1, nameKey: 'onion', basePrice: 2400, volatility: 50 },
    { id: 2, nameKey: 'cotton', basePrice: 7200, volatility: 120 },
    { id: 3, nameKey: 'soybean', basePrice: 4500, volatility: 80 }
  ]);

  useEffect(() => {
    // Mock Volatility Engine: updates price every 3 seconds
    const interval = setInterval(() => {
      setPrices(prevPrices => prevPrices.map(crop => {
        const change = (Math.random() * crop.volatility * 2) - crop.volatility;
        return {
          ...crop,
          currentPrice: Math.max(crop.basePrice * 0.5, crop.basePrice + change), // Ensure it doesn't go below 50%
          isUp: change >= 0,
          changeAmt: Math.abs(change)
        };
      }));
    }, 3000);

    // Initial population
    setPrices(prevPrices => prevPrices.map(crop => ({
      ...crop,
      currentPrice: crop.basePrice,
      isUp: true,
      changeAmt: 0
    })));

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="w-full glass-card overflow-hidden py-3 mb-6 relative z-10"
      aria-label="Live Mandi Price Volatility Ticker"
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...prices, ...prices, ...prices].map((crop, idx) => (
            <div key={`${crop.id}-${idx}`} className="flex items-center px-8">
              <span className="font-medium text-white mr-2">
                {translations.tickers[crop.nameKey]}:
              </span>
              <span className="font-bold text-gray-200 mr-2">
                ₹{crop.currentPrice?.toFixed(0) || crop.basePrice}
              </span>
              <span 
                className={`flex items-center text-sm font-extrabold ${crop.isUp ? 'text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 'text-[#FFB300] drop-shadow-[0_0_8px_rgba(255,179,0,0.8)]'}`}
              >
                {crop.isUp ? '▲' : '▼'} ₹{crop.changeAmt?.toFixed(0) || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Required style block to handle CSS marquee animation specific to this ticker */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}} />
    </div>
  );
};

export default PriceTicker;
