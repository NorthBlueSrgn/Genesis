
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ChevronUp, ChevronDown, Terminal, Trash2 } from 'lucide-react';
import { LogType } from '../types';

const typeColors: Record<LogType, string> = {
    'SYSTEM': 'text-cyan-400',
    'COMBAT': 'text-green-400',
    'GROWTH': 'text-purple-400',
    'WARNING': 'text-red-400',
    'NET': 'text-blue-400'
};

const SystemLog: React.FC = () => {
    const { gameState } = useGameState();
    const [isOpen, setIsOpen] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const logs = gameState?.logs || [];

    useEffect(() => {
        if (isOpen && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isOpen]);

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 z-[60] flex flex-col transition-all duration-300 ease-in-out md:left-64
                ${isOpen ? 'h-64' : 'h-10'}
                border-t border-purple-500/30 bg-black/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.5)]
            `}
        >
            {/* Header / Toggle Bar */}
            <div 
                className="flex items-center justify-between px-4 h-10 cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold tracking-widest">
                    <Terminal size={14} />
                    SYSTEM_LOG_V.5.0
                    <span className="animate-pulse">_</span>
                </div>
                <div className="flex items-center gap-4">
                    {logs.length > 0 && !isOpen && (
                        <span className="text-[10px] font-mono text-gray-500 hidden sm:block">
                            LAST: {logs[0].message.substring(0, 40)}...
                        </span>
                    )}
                    {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
                </div>
            </div>

            {/* Log Content */}
            <div className="flex-grow overflow-y-auto p-4 font-mono text-xs space-y-1 custom-scrollbar">
                {[...logs].reverse().map((log) => (
                    <div key={log.id} className="flex gap-2">
                        <span className="text-gray-600 flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className={`font-bold ${typeColors[log.type]}`}>[{log.type}]</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
                <div ref={logsEndRef} />
                {logs.length === 0 && (
                    <div className="text-gray-600 italic text-center mt-4">System initialized. Awaiting input...</div>
                )}
            </div>
            
            {/* Decorative Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-20"></div>
        </div>
    );
};

export default SystemLog;
