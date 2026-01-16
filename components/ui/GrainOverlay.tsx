
import React from 'react';
import { Signal, Radio, Zap } from 'lucide-react';

const GrainOverlay: React.FC = () => {
  return (
    <>
      <div className="noise-layer" />
      <div className="vignette-hud">
        {/* Corner Brackets */}
        <div className="hud-bracket top-10 left-10 border-r-0 border-b-0" />
        <div className="hud-bracket top-10 right-10 border-l-0 border-b-0" />
        <div className="hud-bracket bottom-10 left-10 border-r-0 border-t-0" />
        <div className="hud-bracket bottom-10 right-10 border-l-0 border-t-0" />
        
        {/* Signal Indicators */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20">
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Frequency_Stable</span>
            </div>
            <div className="flex items-center gap-1">
                <Signal size={10} className="text-white" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Bandwidth_B256</span>
            </div>
        </div>

        {/* Tactical Telemetry */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-1 opacity-20">
             <div className="text-[7px] font-black uppercase text-white flex items-center gap-2">
                <Radio size={8} /> LATENCY: 0.04ms
             </div>
             <div className="text-[7px] font-black uppercase text-white flex items-center gap-2">
                <Zap size={8} /> UPLINK: SECURE
             </div>
        </div>
      </div>
    </>
  );
};

export default GrainOverlay;
