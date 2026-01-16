
// components/CommandPalette.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { Terminal, Activity, Droplets, Utensils, CheckCircle, Search, Zap, Plus, Headphones, Globe } from 'lucide-react';
import { StatName, SubStatName } from '../types';

const COMMANDS = [
    { id: 'log_steps', label: 'Log Steps', syntax: '> steps [amount]', icon: Activity, desc: 'Update daily activity.' },
    { id: 'log_water', label: 'Log Water', syntax: '> water', icon: Droplets, desc: 'Add 250ml hydration.' },
    { id: 'log_cals', label: 'Log Calories', syntax: '> cal [amount]', icon: Utensils, desc: 'Quick add calories.' },
    { id: 'log_protein', label: 'Log Protein', syntax: '> prot [amount]', icon: Utensils, desc: 'Quick add protein (g).' },
    { id: 'log_immersion', label: 'Log Immersion', syntax: '> immerse [hours]', icon: Globe, desc: 'Log Dreaming Spanish hours.' },
    { id: 'add_task', label: 'Quick Task', syntax: '> task [description]', icon: Plus, desc: 'Add a generic daily task.' },
    { id: 'focus_mode', label: 'Focus Mode', syntax: '> focus', icon: Zap, desc: 'Navigate to Deep Work.' },
];

const CommandPalette: React.FC = () => {
    const { gameState, updateDailyMetrics, applyStatBoost, addToast, dispatch } = useGameState();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = COMMANDS.filter(c => 
        c.label.toLowerCase().includes(input.toLowerCase()) || 
        c.syntax.toLowerCase().includes(input.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setInput('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const executeCommand = (cmdId: string, args: string) => {
        if (!gameState) return;

        switch (cmdId) {
            case 'log_steps':
                const steps = parseInt(args) || 0;
                const newSteps = gameState.dailyMetrics.steps + steps;
                updateDailyMetrics({ steps: newSteps });
                addToast(`Logged ${steps} steps. Total: ${newSteps}`, 'success');
                if (newSteps >= 10000 && gameState.dailyMetrics.steps < 10000) {
                    applyStatBoost(StatName.Vitality, SubStatName.Stamina, 15);
                }
                break;
            case 'log_water':
                const newWater = gameState.dailyMetrics.waterIntake + 1;
                updateDailyMetrics({ waterIntake: newWater });
                addToast(`Hydration logged. Total: ${(newWater * 0.25).toFixed(2)}L`, 'success');
                break;
            case 'log_cals':
                const cals = parseInt(args) || 0;
                updateDailyMetrics({ calories: gameState.dailyMetrics.calories + cals });
                addToast(`Logged ${cals} kcal.`, 'info');
                break;
            case 'log_protein':
                const prot = parseInt(args) || 0;
                updateDailyMetrics({ protein: gameState.dailyMetrics.protein + prot });
                addToast(`Logged ${prot}g Protein.`, 'info');
                break;
            case 'log_immersion':
                const hours = parseFloat(args) || 0;
                const currentImmersion = gameState.dailyMetrics.immersionHours || 0;
                updateDailyMetrics({ immersionHours: currentImmersion + hours });
                addToast(`Logged ${hours} immersion hours. Signal synced.`, 'success');
                break;
            case 'add_task':
                if (!args.trim()) return;
                addToast("Quick Task recorded to System Log.", 'info');
                dispatch({ type: 'ADD_LOG', payload: { id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'SYSTEM', message: `Quick Note: ${args}` } });
                break;
            case 'focus_mode':
                window.location.hash = '#/focus';
                break;
        }
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const directMatch = COMMANDS.find(c => input.startsWith(c.syntax.split(' ')[0].replace('>', '').trim()));
        
        if (directMatch) {
            const args = input.replace(directMatch.syntax.split(' ')[0].replace('>', '').trim(), '').trim();
            executeCommand(directMatch.id, args);
        } else if (filteredCommands.length > 0) {
            const cmd = filteredCommands[selectedIndex];
            if (cmd.syntax.includes('[') && input.trim() === cmd.syntax.split(' ')[0].replace('>', '').trim()) {
                 // No action
            } else if (cmd.syntax.includes('[')) {
                 setInput(cmd.syntax.split(' ')[0].replace('>', '').trim() + ' ');
                 return;
            } else {
                executeCommand(cmd.id, '');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh] transition-all duration-200">
            <div className="w-full max-w-2xl bg-[#0d1117] border border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center p-4 border-b border-gray-800">
                    <Terminal className="w-5 h-5 text-purple-500 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        className="flex-grow bg-transparent border-none outline-none text-white font-mono text-lg placeholder-gray-600"
                        placeholder="Type a command..."
                        autoFocus
                    />
                    <div className="hidden md:flex gap-2">
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">ESC</span>
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">↵</span>
                    </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, index) => (
                            <div
                                key={cmd.id}
                                onClick={() => {
                                    if (cmd.syntax.includes('[')) {
                                        setInput(cmd.syntax.split(' ')[0].replace('>', '').trim() + ' ');
                                        inputRef.current?.focus();
                                    } else {
                                        executeCommand(cmd.id, '');
                                    }
                                }}
                                className={`flex items-center p-3 cursor-pointer transition-colors ${index === selectedIndex ? 'bg-purple-900/20 border-l-2 border-purple-500' : 'hover:bg-gray-800 border-l-2 border-transparent'}`}
                            >
                                <cmd.icon className={`w-5 h-5 mr-3 ${index === selectedIndex ? 'text-purple-400' : 'text-gray-500'}`} />
                                <div className="flex-grow">
                                    <p className={`font-bold ${index === selectedIndex ? 'text-white' : 'text-gray-300'}`}>{cmd.label}</p>
                                    <p className="text-xs text-gray-500">{cmd.desc}</p>
                                </div>
                                <span className="font-mono text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded">{cmd.syntax}</span>
                            </div>
                        ))
                    ) : (
                        <form onSubmit={handleSubmit}>
                             <button type="submit" className="hidden"></button>
                             <div className="p-4 text-center text-gray-500">
                                No matching commands. Press Enter to execute raw input.
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
