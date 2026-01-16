
import React, { useState } from 'react';
import { Task, TaskReport, EvaluationResult, TaskType, SubStatName } from '../types';
import { useGameState } from '../contexts/GameStateContext';
import { evaluateTaskReport } from '../services/geminiService';
import Card from './ui/Card';
import { X, Send, Award, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { BINARY_SUBSTATS } from '../constants';

interface TaskCompletionModalProps {
    task: Task;
    pathName?: string; // For context
    pathId?: string; // For execution
    missionId?: string; // For execution
    onClose: () => void;
}

const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({ task, pathName, pathId, missionId, onClose }) => {
    const { completeTask, completeMission, gameState, addLog } = useGameState();
    const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
    const [report, setReport] = useState<TaskReport>({ type: 'NON_BINARY' });
    const [result, setResult] = useState<EvaluationResult | null>(null);

    const isBinary = BINARY_SUBSTATS.has(task.statBoost.subStat);

    React.useEffect(() => {
        setReport(prev => ({ ...prev, type: isBinary ? 'BINARY' : 'NON_BINARY' }));
    }, [isBinary]);

    const handleSubmit = async () => {
        setStep('analyzing');
        try {
            const context = {
                description: task.description,
                expectedXp: task.xp,
                statName: task.statBoost.stat,
                subStatName: task.statBoost.subStat,
                rank: gameState?.rank.name || 'E'
            };

            const evalResult = await evaluateTaskReport(report, context);
            setResult(evalResult);
            setStep('result');
            
            // Automatically log the attempt
            addLog(`Task Evaluation: ${evalResult.pass ? 'PASSED' : 'FLAGGED'} - ${task.description}`, evalResult.pass ? 'GROWTH' : 'WARNING');

        } catch (error) {
            console.error("Evaluation error:", error);
            // Fallback for offline or error
            const fallbackResult: EvaluationResult = {
                pass: true,
                xpAwarded: task.xp,
                statAmount: task.statBoost.amount,
                critique: "Network unreachable. Offline protocols engaged. Standard rewards issued."
            };
            setResult(fallbackResult);
            setStep('result');
        }
    };

    const handleConfirmReward = () => {
        if (!result) return;
        
        if (pathId) {
            completeTask(pathId, task.id, result); // Add result to completeTask signature in context
        } else if (missionId) {
            completeMission(missionId, result); // Add result to completeMission signature in context
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl relative border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                {step !== 'analyzing' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                        <X />
                    </button>
                )}

                <div className="mb-6 border-b border-gray-700/50 pb-4">
                    <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Terminal size={24} className="text-purple-400" />
                        TACTICAL DEBRIEF
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                    <div className="mt-2 flex gap-2 text-xs font-mono">
                        <span className="bg-gray-800 px-2 py-1 rounded text-purple-300">{pathName || 'Directive'}</span>
                        <span className="bg-gray-800 px-2 py-1 rounded text-cyan-300">{task.statBoost.subStat}</span>
                    </div>
                </div>

                {step === 'input' && (
                    <div className="space-y-4">
                        {isBinary ? (
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">METRIC OUTPUT</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="number" 
                                        placeholder="Value"
                                        className="flex-grow bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                        onChange={e => setReport({...report, metricValue: Number(e.target.value)})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Unit (e.g. kg, mins)"
                                        className="w-1/3 bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                        onChange={e => setReport({...report, metricUnit: e.target.value})}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-500 italic">This is a qualitative task. Central requires a structured report to verify competence.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">INTENT</label>
                                        <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm" placeholder="What was the specific goal?" onChange={e => setReport({...report, intent: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">ACTION</label>
                                        <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm" placeholder="What did you actually do?" onChange={e => setReport({...report, action: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">OUTCOME & DELTA</label>
                                    <textarea className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm h-20" placeholder="Result? Gap between intent and reality?" onChange={e => setReport({...report, outcome: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">LESSONS</label>
                                    <textarea className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm h-16" placeholder="What rule did you learn?" onChange={e => setReport({...report, lessons: e.target.value})} />
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleSubmit} 
                            disabled={isBinary ? !report.metricValue : !report.lessons}
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} /> SUBMIT REPORT
                        </button>
                    </div>
                )}

                {step === 'analyzing' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-400 font-orbitron animate-pulse">CENTRAL IS ANALYZING PERFORMANCE...</p>
                        <p className="text-gray-600 text-xs mt-2 font-mono">Verifying capabilities against Grade {gameState?.rank.name} standards.</p>
                    </div>
                )}

                {step === 'result' && result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`p-4 rounded border mb-6 ${result.pass ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {result.pass ? <CheckCircle className="text-green-400" /> : <AlertTriangle className="text-red-400" />}
                                <h3 className={`text-xl font-bold font-orbitron ${result.pass ? 'text-green-300' : 'text-red-300'}`}>
                                    {result.pass ? 'CAPABILITY VERIFIED' : 'PERFORMANCE FLAGGED'}
                                </h3>
                            </div>
                            <p className="text-gray-300 text-sm font-mono leading-relaxed">"{result.critique}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-black/40 p-3 rounded text-center border border-gray-700">
                                <p className="text-xs text-gray-500 uppercase">XP Awarded</p>
                                <p className="text-2xl font-bold text-cyan-400">+{result.xpAwarded}</p>
                                {result.xpAwarded > task.xp && <span className="text-[10px] text-yellow-400 font-bold">BURST DETECTED</span>}
                            </div>
                            <div className="bg-black/40 p-3 rounded text-center border border-gray-700">
                                <p className="text-xs text-gray-500 uppercase">Stat Impact</p>
                                <p className="text-2xl font-bold text-purple-400">+{result.statAmount}</p>
                                <p className="text-[10px] text-gray-500">{task.statBoost.subStat}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirmReward} 
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Award size={18} /> CLAIM REWARDS
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TaskCompletionModal;
