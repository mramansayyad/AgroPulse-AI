import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, ScanLine } from 'lucide-react';

const CameraDiagnosis = ({ aiService, onResult, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    setIsOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // In a real app we'd show an error to the user if permission denied
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsOpen(false);
    setIsScanning(false);
  };

  const snapAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    
    // Draw current video frame to canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get Base64 JPEG
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    // Turn off camera stream visually
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Call Gemini
    const result = await aiService.diagnoseCropHealth(base64Image, 'image/jpeg');
    
    setIsScanning(false);
    setIsOpen(false);
    onResult(result);
  };

  // Cleanup on unmount
  useEffect(() => {
    return stopCamera;
  }, []);

  return (
    <>
      <button
        onClick={startCamera}
        aria-label={translations.snapAnalyzeBtn}
        className="w-full bg-transparent border-2 border-[#39FF14] text-[#39FF14] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#39FF14]/10 transition"
      >
        <Camera />
        {translations.snapAnalyzeBtn}
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#0D1B11]/95 z-50 flex flex-col items-center justify-center p-6">
          
          <button 
            onClick={stopCamera}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            aria-label="Close Camera"
          >
            <X size={28} />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">
            {isScanning ? translations.scanning : "Align crop within frame"}
          </h2>

          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-[#39FF14]/30">
            {!isScanning && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            )}
            
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <ScanLine size={64} className="text-[#39FF14] animate-[pulse_1s_ease-in-out_infinite]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-[#39FF14] animate-[scan_2s_linear_infinite] shadow-[0_0_15px_#39FF14]" />
              </div>
            )}
          </div>

          {!isScanning && (
            <button
              onClick={snapAndAnalyze}
              className="mt-8 w-20 h-20 rounded-full border-4 border-[#39FF14] bg-[#39FF14]/20 flex items-center justify-center hover:bg-[#39FF14]/40 transition"
              aria-label="Capture and Diagnose"
            >
              <div className="w-14 h-14 rounded-full bg-[#39FF14] shadow-[0_0_15px_#39FF14]" />
            </button>
          )}

          {/* Hidden canvas for image extraction */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
      `}} />
    </>
  );
};

export default CameraDiagnosis;
