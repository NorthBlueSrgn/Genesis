
import React, { useState, useEffect } from 'react';
import { Dna, Flame } from 'lucide-react';

const SplashSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING_UPLINK...');

  useEffect(() => {
    const statuses = [
      'NEGOTIATING_HANDSHAKE...',
      'DECRYPTING_ASSET_DNA...',
      'STABILIZING_RESONANCE...',
      'BYPASSING_FIREWALL...',
      'ESTABLISHING_AUTHORITY...'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        const next = prev + Math.random() * 12;
        setStatus(statuses[Math.floor((next / 100) * statuses.length)] || statuses[statuses.length - 1]);
        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[300] bg-[#010409] flex flex-col items-center justify-center font-mono p-6">
      <div className="absolute inset-0 bg-film-grain opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />
      
      <div className="relative w-full max-w-md p-10 border border-purple-500/20 bg-purple-950/5 text-center">
        <Dna size={64} className="text-purple-500 animate-pulse mb-8 mx-auto" />
        
        <div className="mb-10 animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="flex justify-center mb-2 text-amber-500/40">
                <Flame size={16} />
            </div>
            <p className="text-[12px] text-gray-500 font-serif italic leading-relaxed">
                "Run in such a way as to get the prize."
            </p>
            <p className="text-[8px] text-gray-700 font-black tracking-widest mt-2 uppercase">1 Corinthians 9:24</p>
        </div>

        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden mb-4 border border-gray-800">
          <div 
            className="h-full bg-purple-600 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <div className="h-4">
          <p className="text-[10px] text-purple-400 font-black tracking-[0.3em] uppercase animate-flicker">
            {status}
          </p>
        </div>
        
        <div className="absolute -bottom-10 left-0 right-0 text-center">
          <span className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.5em]">PROTOCOL_GENESIS_CORE</span>
        </div>
      </div>
    </div>
  );
};

export default SplashSequence;
