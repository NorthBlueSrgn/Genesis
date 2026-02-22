import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ChevronUp, ChevronDown, Terminal } from 'lucide-react';
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
            className={`fixed bottom-0 left-0 right-0 z-[40] flex flex-col transition-all duration-300 ease-in-out md:left-64
                ${isOpen ? 'h-40' : 'h-9'}
                border-t border-purple-500/30 bg-black/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.5)]
            `}
        >
            {/* Header / Toggle Bar */}
            <button
                type="button"
                className="flex items-center justify-between px-4 h-9 cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 transition-colors w-full text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400 font-bold tracking-[0.25em]">
                    <Terminal size={13} />
                    SYSTEM_LOG_V.5.0
                    <span className="hidden xs:inline-block animate-pulse">_</span>
                </div>
                <div className="flex items-center gap-3">
                    {logs.length > 0 && !isOpen && (
                        <span className="hidden sm:block text-[9px] font-mono text-gray-500 max-w-[40vw] truncate">
                            LAST: {logs[0].message}
                        </span>
                    )}
                    {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
                </div>
            </button>

            {/* Log Content */}
            <div className="flex-grow overflow-y-auto p-3 font-mono text-[11px] space-y-1.5 custom-scrollbar">
                {[...logs].reverse().map((log) => (
                    <div key={log.id} className="flex gap-2">
                        <span className="text-gray-600 flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                        <span className={`font-bold ${typeColors[log.type]}`}>[{log.type}]</span>
                        <span className="text-gray-300">{log.message}</span>
                    </div>
                ))}
                <div ref={logsEndRef} />
                {logs.length === 0 && (
                    <div className="text-gray-600 italic text-center mt-2 text-[10px]">
                        System initialized. Awaiting input...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemLog;
