// pages/OnboardingPage.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { Stat, StatName, SubStatName, AttributeRankName, TraitScores, FullCalibrationReport, TalentDna, TalentClass, ObsessionLevel, ResonanceVector, SubStat, ResonanceType, CalibrationBenchmark } from '../types';
import { INITIAL_STATS, STAT_SUBSTAT_MAP, getRankForMainStatValue, getRankForSubstatValue, RANKS } from '../constants';
import { generateFullCalibrationReport, evaluateCreativityAnswers, evaluatePsychometricData, evaluateEquilibriumPerformance, generateAdaptiveQuestion, generateWarRoomScenario, evaluateKnowledgeAnswer } from '../services/geminiService';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { CALIBRATION_BENCHMARKS, HOBBY_LIST } from '../data/calibrationData';
import { MBTI_QUESTIONS, calculateMBTI } from '../data/mbtiData';
import { KNOWLEDGE_QUESTIONS_V2, getAdaptiveQuestionV2, checkAnswer, KnowledgeQuestionV2 } from '../data/knowledgeQuestionBankV2';
import { CREATIVITY_ASSESSMENT_PROMPTS } from '../data/creativityAssessmentFinal';
import { ArrowRight, Check, X, Timer, Terminal, BrainCircuit, Activity, SkipForward, Swords, Shield, Zap, Grid, Eye, Send, Lock, Scale, MousePointer2, AlertTriangle, Fingerprint, Shuffle, Circle, Square, Wind, Lightbulb, Target, Book, PenTool, Scale as Scales, StopCircle, Triangle, Hexagon, Star, HelpCircle, Diamond, Database, MousePointer, ShieldAlert, FileWarning, Cpu, Scan, RefreshCw, RotateCcw, Clock, MoveHorizontal, Info, ChevronRight, Signal, AlertOctagon, TrendingUp, SwordsIcon, Map as MapIcon, Flag, Globe, Landmark, UserCheck, Sparkles, Wand2, Activity as Pulse, Palette } from 'lucide-react';
import { performTraitAnalysis, calculateCeilingRank, mapScoreToRank, calculateTalentDistribution, getPercentileForSubstat, calculateInitialResonanceVector, convertPercentileToSubstatValue, calculateScores, generateCodename, getPercentileForMetric, calculateSubstatsFromAllTests, interpolate } from '../services/scoringService';
import { ClassifiedDossier } from '../components/ClassifiedDossier';
import { useToast } from '../components/ui/ToastProvider';
import LabyrinthPage from './LabyrinthPage';

// Helper for shuffling options
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    const n = newArr.length;
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// --- STYLED WRAPPER FOR TERMINAL COMPONENTS ---
export const TerminalShell: React.FC<{ children: React.ReactNode; title: string; footer?: string; accentClass?: string }> = ({ children, title, footer, accentClass = "border-purple-900/50" }) => (
    <div className={`cyber-terminal w-full h-full sm:max-w-2xl sm:mx-auto rounded-sm border ${accentClass} flex flex-col animate-flicker shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden`}>
        {/* Screening Grain & Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.07] bg-film-grain mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.1] scanline-overlay" />
        
        <div className={`bg-black/40 border-b ${accentClass} p-2 sm:p-3 flex justify-between items-center relative overflow-hidden flex-shrink-0 z-10`}>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink">
                <Terminal size={12} className="text-current opacity-70 flex-shrink-0" />
                <span className="font-orbitron font-bold text-[8px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] text-current uppercase truncate">{title}</span>
            </div>
            <div className="flex gap-1 opacity-50 flex-shrink-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-900/50 border border-red-500/50" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-900/50 border border-yellow-500/50" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-900/50 border border-green-500/50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 animate-scan pointer-events-none" />
        </div>
        
        <div className="p-3 sm:p-6 md:p-8 flex-grow relative bg-[#050505] flex flex-col min-h-fit sm:min-h-[500px] z-10 overflow-y-auto">
            {children}
        </div>
        
        {footer && (
            <div className={`bg-black border-t ${accentClass} p-1.5 sm:p-2 px-3 sm:px-4 flex justify-between items-center text-[8px] sm:text-[10px] font-mono text-gray-600 flex-shrink-0 z-10`}>
                <span className="flex items-center gap-1 truncate"><Cpu size={8} className="flex-shrink-0" /> SYS.CORE.V5.0</span>
                <span className="hidden sm:block">{footer}</span>
            </div>
        )}
    </div>
);

const NarrativeInput: React.FC<{ prompt: string, onComplete: (text: string) => void }> = ({ prompt, onComplete }) => {
    const [text, setText] = useState('');
    return (
        <TerminalShell title="Narrative Projection // Initial Uplink">
            <h2 className="text-lg font-orbitron mb-4 text-purple-400 uppercase tracking-widest leading-tight">{prompt}</h2>
            <div className="relative flex-grow flex flex-col">
                <textarea 
                    className="w-full bg-black border border-gray-800 rounded p-4 text-cyan-50 font-mono flex-grow mb-6 focus:border-purple-500 outline-none transition-colors resize-none"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Input thought streams here..."
                />
                <div className="absolute bottom-10 right-4 text-[10px] text-gray-700 font-mono uppercase">Telemetry Active</div>
            </div>
            <button onClick={() => onComplete(text)} disabled={!text.trim()} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black font-orbitron py-4 tracking-[0.2em] rounded-sm transition-all disabled:opacity-30 disabled:grayscale">
                TRANSMIT DATA
            </button>
        </TerminalShell>
    );
};

const Questionnaire: React.FC<{ questions: any[], onComplete: (data: any) => void }> = ({ questions, onComplete }) => {
    const [answers, setAnswers] = useState<Record<string, string>>(() => {
        const defaults: Record<string, string> = {};
        questions.forEach(q => {
            if (q.defaultValue) defaults[q.key] = q.defaultValue;
        });
        return defaults;
    });
    const handleChange = (key: string, value: string) => { setAnswers(prev => ({...prev, [key]: value})); };
    const isComplete = questions.every(q => {
        const val = answers[q.key];
        return val !== undefined && val !== null && val !== "";
    });
    return (
        <TerminalShell title="Hardware Telemetry // Data Entry">
            <div className="space-y-6 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                {questions.map((q) => (
                    <div key={q.key} className="border-l-2 border-gray-800 pl-4 py-1 hover:border-purple-500 transition-colors group">
                        <label className="block text-[10px] font-bold text-gray-500 group-hover:text-purple-400 mb-2 uppercase tracking-widest">{q.prompt}</label>
                        {q.inputType === 'select' ? (
                            <select className="w-full bg-black border border-gray-800 rounded p-3 text-cyan-50 font-mono focus:border-purple-500 outline-none" onChange={e => handleChange(q.key, e.target.value)} value={answers[q.key] || ''}>
                                <option value="" disabled className="text-gray-600">Select parameter...</option>
                                {q.answers?.map((a: any) => <option key={a.text} value={a.text}>{a.text}</option>)}
                            </select>
                        ) : q.inputType === 'range' ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-gray-600 w-24 uppercase font-bold text-left">{q.rangeLabels?.min}</span>
                                    <input type="range" min={q.min} max={q.max} className="flex-grow accent-purple-500 h-1 bg-gray-900 rounded-lg cursor-pointer" onChange={e => handleChange(q.key, e.target.value)} value={answers[q.key] || q.defaultValue || q.min}/>
                                    <span className="text-[10px] text-gray-600 w-24 uppercase font-bold text-right">{q.rangeLabels?.max}</span>
                                </div>
                                <div className="text-center font-mono text-purple-400 font-bold text-sm tracking-tighter">VALUE: {answers[q.key] || q.defaultValue || q.min}</div>
                            </div>
                        ) : (
                            <input type="text" className="w-full bg-black border border-gray-800 rounded p-3 text-cyan-50 font-mono focus:border-purple-500 outline-none" onChange={e => handleChange(q.key, e.target.value)} value={answers[q.key] || ''}/>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => onComplete(answers)} disabled={!isComplete} className="w-full bg-white text-black font-black font-orbitron py-4 tracking-[0.2em] rounded-sm transition-all mt-8 disabled:opacity-30 flex-shrink-0">VERIFY & COMMIT</button>
        </TerminalShell>
    );
};

const MBTITest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const handleAnswer = (value: number) => {
        const newAnswers = { ...answers, [qIndex]: value };
        setAnswers(newAnswers);
        if (qIndex >= MBTI_QUESTIONS.length - 1) onComplete({ mbtiResult: calculateMBTI(newAnswers) });
        else setQIndex(qIndex + 1);
    };
    const question = MBTI_QUESTIONS[qIndex];
    const progress = ((qIndex + 1) / MBTI_QUESTIONS.length) * 100;
    return (
        <TerminalShell title="Psychometric Profiling // MBTI-24">
            <div className="w-full bg-gray-900 h-1 rounded-full mb-8 relative">
                <div className="bg-cyan-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#06b6d4]" style={{ width: `${progress}%` }} />
                <div className="absolute -top-4 right-0 text-[8px] text-cyan-600 font-mono uppercase tracking-widest">Calibration: {Math.round(progress)}%</div>
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <p className="text-xl text-white mb-12 text-center font-serif italic leading-relaxed px-4">"{question.text}"</p>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-[8px] text-gray-500 uppercase tracking-[0.4em] px-2 mb-1"><span>DISAGREE</span><span>NEUTRAL</span><span>AGREE</span></div>
                    <div className="flex justify-between items-center gap-2">
                        {[1, 2, 3, 4, 5].map(val => (
                            <button key={val} onClick={() => handleAnswer(val)} className="flex-grow h-14 bg-black border border-gray-800 rounded-sm hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-500 hover:text-white font-bold font-mono transition-all relative overflow-hidden">
                                {val}{val === 3 && <div className="absolute inset-0 bg-white/5 pointer-events-none" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </TerminalShell>
    );
};

const FittsLawTest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [targets, setTargets] = useState(0);
    const [misses, setMisses] = useState(0);
    const [activeTarget, setActiveTarget] = useState<{ x: number, y: number, size: number } | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [testStartTime] = useState(performance.now());
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [accuracyByPhase, setAccuracyByPhase] = useState<Record<string, number[]>>({ early: [], mid: [], late: [] });
    const TOTAL_TARGETS = 16;

    const getPhaseLabel = (targetNum: number): string => {
        if (targetNum <= 5) return 'early';
        if (targetNum <= 11) return 'mid';
        return 'late';
    };

    const getDifficulty = (targetNum: number): { size: number, moveDistance: number } => {
        // Progressive difficulty: size decreases exponentially
        const progress = targetNum / TOTAL_TARGETS; // 0 to 1
        
        // Size: starts at 45px, ends at 8px with exponential curve
        const size = Math.max(8, 45 * Math.pow(0.2, progress));
        
        // Move distance: increases exponentially (targets spawn further apart)
        const moveDistance = 15 + (70 * progress * progress);
        
        return { size: Math.round(size), moveDistance };
    };

    const spawnTarget = useCallback(() => {
        if (targets >= TOTAL_TARGETS) {
            const totalTime = (performance.now() - testStartTime) / 1000;
            const totalAttempts = TOTAL_TARGETS + misses;
            const accuracy = (TOTAL_TARGETS / totalAttempts) * 100;
            const avgReaction = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;
            const rtStdDev = reactionTimes.length > 1
                ? Math.sqrt(reactionTimes.reduce((sum, rt) => sum + Math.pow(rt - avgReaction, 2), 0) / reactionTimes.length)
                : 0;
            
            // Detect fatigue: compare early vs late accuracy
            const earlyAcc = accuracyByPhase.early.length > 0 
                ? (accuracyByPhase.early.reduce((a, b) => a + b, 0) / accuracyByPhase.early.length)
                : 50;
            const lateAcc = accuracyByPhase.late.length > 0 
                ? (accuracyByPhase.late.reduce((a, b) => a + b, 0) / accuracyByPhase.late.length)
                : 50;
            const fatigueDetected = earlyAcc - lateAcc > 15; // 15% drop = fatigue
            
            const score = Math.max(0, (TOTAL_TARGETS / totalTime) * 10 * (accuracy / 100));
            
            onComplete({ 
                avgReactionMs: avgReaction,
                rtVariability: rtStdDev,
                reactionTimes,
                fastestMs: Math.min(...reactionTimes),
                slowestMs: Math.max(...reactionTimes),
                accuracy, 
                accuracyByPhase,
                fatigueDetected,
                score,
                totalTime,
                speedAccuracyScore: score * (accuracy / 100) // Weight accuracy
            });
            return;
        }

        const { size, moveDistance } = getDifficulty(targets);
        const maxX = Math.max(moveDistance, 100 - moveDistance);
        const maxY = Math.max(moveDistance, 100 - moveDistance);
        
        setActiveTarget({ 
            x: moveDistance + Math.random() * (maxX - moveDistance),
            y: moveDistance + Math.random() * (maxY - moveDistance),
            size 
        });
        setStartTime(performance.now());
    }, [targets, misses, reactionTimes, testStartTime, accuracyByPhase, onComplete]);

    const handleTargetClick = (e: React.MouseEvent) => { 
        e.stopPropagation();
        const reactionTime = performance.now() - startTime;
        const phase = getPhaseLabel(targets);
        
        setReactionTimes(prev => [...prev, reactionTime]);
        
        // Track accuracy by phase
        setAccuracyByPhase(prev => ({
            ...prev,
            [phase]: [...(prev[phase as keyof typeof prev] || []), 100]
        }));
        
        setTargets(t => t + 1); 
        setActiveTarget(null); 
    };

    const handleMiss = () => { 
        if (activeTarget) {
            const phase = getPhaseLabel(targets);
            setMisses(m => m + 1);
            
            // Track accuracy by phase
            setAccuracyByPhase(prev => ({
                ...prev,
                [phase]: [...(prev[phase as keyof typeof prev] || []), 0]
            }));
        }
    };

    useEffect(() => { 
        if (!activeTarget && targets <= TOTAL_TARGETS) spawnTarget(); 
    }, [activeTarget, targets, spawnTarget]);

    return (
        <TerminalShell title="CNS Calibration // Sniper's Eye">
            <div className="relative w-full aspect-square bg-black border border-gray-800 rounded-sm overflow-hidden cursor-crosshair" onClick={handleMiss}>
                {activeTarget && (
                    <button 
                        onClick={handleTargetClick} 
                        className="absolute bg-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4] hover:shadow-[0_0_40px_#06b6d4] transition-all active:scale-90" 
                        style={{ 
                            left: `${activeTarget.x}%`, 
                            top: `${activeTarget.y}%`, 
                            width: `${activeTarget.size}px`, 
                            height: `${activeTarget.size}px`, 
                            transform: 'translate(-50%, -50%)' 
                        }}
                    />
                )}
            </div>
        </TerminalShell>
    );
};

const ResilienceStroop: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    // Progressive difficulty: colors increase as rounds progress
    const allColors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK'];
    const allColorValues = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-400', 'text-purple-500', 'text-orange-500', 'text-pink-500'];
    
    const [round, setRound] = useState(1);
    const [current, setCurrent] = useState({ text: '', colorIdx: 0 });
    const [score, setScore] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [accuracyByPhase, setAccuracyByPhase] = useState<Record<string, number[]>>({ warmup: [], plateau: [], fatigue: [] });
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);
    const TOTAL_ROUNDS = 15;
    
    // Determine difficulty phase and colors
    const getColorCountForRound = (r: number): number => {
        if (r <= 5) return 4;      // Phase 1: 4 colors (warmup)
        if (r <= 10) return 5;     // Phase 2: 5 colors (plateau)
        return 6;                   // Phase 3: 6 colors (fatigue detection)
    };
    
    const getPhaseLabel = (r: number): string => {
        if (r <= 5) return 'warmup';
        if (r <= 10) return 'plateau';
        return 'fatigue';
    };
    
    const nextRound = useCallback(() => {
        if (round > TOTAL_ROUNDS) { 
            const avgReaction = reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;
            const rtStdDev = reactionTimes.length > 1
                ? Math.sqrt(reactionTimes.reduce((sum, rt) => sum + Math.pow(rt - avgReaction, 2), 0) / reactionTimes.length)
                : 0;
            
            // Detect fatigue: compare plateau vs fatigue accuracy
            const plateauAcc = accuracyByPhase.plateau.length > 0 
                ? (accuracyByPhase.plateau.reduce((a, b) => a + b, 0) / accuracyByPhase.plateau.length) 
                : 0;
            const fatigueAcc = accuracyByPhase.fatigue.length > 0 
                ? (accuracyByPhase.fatigue.reduce((a, b) => a + b, 0) / accuracyByPhase.fatigue.length) 
                : 0;
            const fatigueDetected = plateauAcc - fatigueAcc > 10; // 10% drop = fatigue
            
            onComplete({ 
                stroopScore: score,
                reactionTimes,
                avgReactionTime: avgReaction,
                rtVariability: rtStdDev,
                fastestReaction: Math.min(...reactionTimes),
                slowestReaction: Math.max(...reactionTimes),
                accuracyByPhase,
                fatigueDetected,
                composureIndex: 100 - (rtStdDev / avgReaction) // Lower variability = higher composure
            }); 
            return; 
        }
        
        const colorCount = getColorCountForRound(round);
        const textIdx = Math.floor(Math.random() * colorCount);
        const colorIdx = Math.floor(Math.random() * colorCount);
        setCurrent({ text: allColors[textIdx], colorIdx });
        setQuestionStartTime(performance.now());
    }, [round, score, reactionTimes, accuracyByPhase, onComplete]);
    
    useEffect(() => { nextRound(); }, [round]);
    
    const handleAnswer = (idx: number) => { 
        const reactionTime = performance.now() - questionStartTime;
        const isCorrect = idx === current.colorIdx;
        const phase = getPhaseLabel(round);
        
        if (isCorrect) {
            setScore(s => s + 1);
            setReactionTimes(prev => [...prev, reactionTime]);
        }
        
        // Track accuracy by phase
        setAccuracyByPhase(prev => ({
            ...prev,
            [phase]: [...(prev[phase as keyof typeof prev] || []), isCorrect ? 100 : 0]
        }));
        
        setRound(r => r + 1); 
    };
    
    return (
        <TerminalShell title="Inhibitory Control // Stroop Protocol">
            <div className="flex flex-col items-center flex-grow justify-center py-4 space-y-4">
                <div className="text-sm text-gray-500 font-mono">
                    PHASE {round <= 5 ? 'I' : round <= 10 ? 'II' : 'III'} • COLORS: {getColorCountForRound(round)} • ROUND {round}/{TOTAL_ROUNDS}
                </div>
                <div className={`text-6xl font-black font-orbitron mb-16 tracking-widest ${allColorValues[current.colorIdx]}`}>{current.text}</div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    {Array.from({ length: getColorCountForRound(round) }).map((_, i: number) => (
                        <button 
                            key={allColors[i]} 
                            onClick={() => handleAnswer(i)} 
                            className="bg-black border border-gray-800 p-4 rounded-sm hover:border-white font-black font-orbitron tracking-widest transition-all"
                        >
                            {allColors[i]}
                        </button>
                    ))}
                </div>
            </div>
        </TerminalShell>
    );
};

const DilemmaScreening: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    // Dilemma substat mapping: each answer code maps to substats it tests
    const answerSubstatMap: Record<string, Record<string, number>> = {
        // Dilemma 1: Process vs Impact
        'PROCESS_FIRST': { Conviction: 80, Willpower: 70, Composure: 60 },
        'IMPACT_OVER_RULES': { Empathy: 75, Purpose: 80, Conviction: 30 },
        'DIALOGUE_FIRST': { Charisma: 75, Empathy: 80, Reason: 60 },
        'SELF_INTEREST': { Resilience: 40, Conviction: 20, Charisma: 50 },
        'NUANCE_SEEKING': { Reason: 80, Conviction: 75, Empathy: 70 },
        // Dilemma 2: Opportunity vs Presence
        'OPPORTUNITY_FIRST': { Resilience: 70, Conviction: 40 },
        'PRESENCE_MATTERS': { Empathy: 85, Purpose: 85, Faith: 75 },
        'CREATIVE_SOLUTION': { Reason: 80, Innovation: 75, Purpose: 70 },
        'CONVINCE_THEM': { Charisma: 70, Conviction: 40 },
        'ACCEPT_PAIN': { Composure: 80, Empathy: 75, Conviction: 85 },
        // Dilemma 3: Friendship Dynamics
        'PURITY_TEST': { Conviction: 85, Willpower: 80 },
        'STRATEGIC_DISTANCE': { Reason: 75, Resilience: 70 },
        'HONEST_CONFRONTATION': { Charisma: 70, Conviction: 75 },
        'TIT_FOR_TAT': { Conviction: 30, Composure: 40 },
        'MATURE_ACCEPTANCE': { Empathy: 80, Reason: 75, Conviction: 70 },
        // Dilemma 4: Medical Autonomy
        'AUTONOMY_ABSOLUTE': { Reason: 80, Conviction: 75 },
        'WEIGH_STAKES': { Reason: 75, Empathy: 75 },
        'PROTECT_CHILD': { Purpose: 85, Conviction: 70, Willpower: 75 },
        'BRIDGE_BUILDING': { Charisma: 75, Reason: 70, Empathy: 70 },
        'EMBRACE_CONFLICT': { Composure: 80, Conviction: 75, Empathy: 70 },
        // Dilemma 5: Charity Dilemma
        'COMPASSION_FIRST': { Empathy: 85, Purpose: 80, Faith: 75 },
        'SELF_PRESERVATION': { Resilience: 70, Conviction: 40 },
        'ENABLE_AGENCY': { Empathy: 70, Reason: 75, Purpose: 75 },
        'PRACTICAL_GENEROSITY': { Empathy: 80, Reason: 75 },
        'BOUNDED_HELP': { Reason: 80, Composure: 75, Empathy: 70 },
        // Dilemma 6: Environmental Ethics
        'TRANSPARENCY_OUTSOURCE': { Conviction: 70, Reason: 80 },
        'INTERNAL_VOICE': { Purpose: 75, Charisma: 70, Conviction: 70 },
        'ROLE_ACCEPTANCE': { Conviction: 30, Resilience: 60 },
        'VOTE_WITH_FEET': { Purpose: 85, Conviction: 80, Willpower: 75 },
        'STRATEGIC_INSIDER': { Reason: 80, Strategy: 75, Purpose: 75 },
        // Dilemma 7: Parental Judgment
        'TRUST_TIMELINE': { Empathy: 85, Purpose: 80, Faith: 75 },
        'INFORMED_HELP': { Reason: 75, Empathy: 75, Purpose: 75 },
        'SHARED_BURDEN': { Resilience: 70, Composure: 70 },
        'PARENTAL_OVERRIDE': { Conviction: 75, Willpower: 80, Purpose: 70 },
        'MEET_THEM_THERE': { Empathy: 85, Charisma: 70, Purpose: 75 },
        // Dilemma 8: Speaking Up Under Risk
        'INTEGRITY_OVER_SAFETY': { Conviction: 90, Purpose: 85, Willpower: 85 },
        'PROTECT_SELF': { Resilience: 60, Conviction: 30 },
        'STRATEGIC_SUPPORT': { Reason: 75, Charisma: 70, Purpose: 70 },
        'INDIRECT_ACTION': { Strategy: 80, Reason: 75, Purpose: 75 },
        'LONG_GAME': { Reason: 80, Strategy: 80, Purpose: 75 },
        // Dilemma 9: Hiring Decision
        'NETWORKS_PRACTICAL': { Conviction: 40, Reason: 50 },
        'CORRECT_IMBALANCES': { Purpose: 85, Empathy: 80, Conviction: 75 },
        'MERIT_NEUTRAL': { Reason: 75, Conviction: 60 },
        'SOLVE_CREATIVELY': { Reason: 80, Innovation: 80, Purpose: 75 },
        'ACKNOWLEDGE_HARM': { Empathy: 85, Conviction: 75, Composure: 75 },
        // Dilemma 10: Unethical Data
        'UTILITARIAN_USE': { Reason: 70, Purpose: 60, Conviction: 40 },
        'PRINCIPLE_OVER_BENEFIT': { Conviction: 85, Purpose: 80, Willpower: 75 },
        'REDEMPTIVE_USE': { Reason: 80, Purpose: 80, Conviction: 75 },
        'CONSENT_SEEKING': { Empathy: 85, Purpose: 85, Reason: 75 },
        'INTEGRITY_SLOWER': { Conviction: 85, Willpower: 80, Purpose: 80 },
        // Dilemma 11: Historical Crime
        'TRUTH_ABSOLUTE': { Conviction: 85, Purpose: 75, Willpower: 80 },
        'REDEMPTION_PATH': { Empathy: 80, Purpose: 80, Reason: 75 },
        'LET_PAST_REST': { Composure: 75, Conviction: 45, Resilience: 70 },
        'GUIDED_HONESTY': { Empathy: 80, Charisma: 75, Purpose: 80 },
        'NO_CLEAN_ANSWER': { Composure: 80, Conviction: 75, Empathy: 75 },
        // Dilemma 12: Group Dissent
        'VOICE_ALWAYS': { Conviction: 75, Charisma: 70, Purpose: 70 },
        'DEFER_TO_GROUP': { Composure: 70, Conviction: 40, Resilience: 60 },
        'PRIVATE_DISSENT': { Reason: 70, Strategy: 75 },
        'GENTLE_CHALLENGE': { Charisma: 75, Reason: 70, Empathy: 70 },
        'STRATEGIC_ALLIES': { Strategy: 80, Charisma: 75, Reason: 70 },
        // Dilemma 13: Helping Against Wishes
        'BREAK_BOUNDARY': { Purpose: 75, Willpower: 75, Conviction: 60 },
        'HANDS_OFF': { Reason: 75, Conviction: 70, Empathy: 60 },
        'SEEK_PERMISSION': { Charisma: 75, Empathy: 80, Reason: 70 },
        'GENTLE_NUDGE': { Charisma: 80, Empathy: 75, Strategy: 70 },
        'SUPPORT_ONLY': { Empathy: 85, Resilience: 75, Purpose: 75 },
        // Dilemma 14: Personal Error
        'INTEGRITY_AUTOMATIC': { Conviction: 90, Willpower: 85, Composure: 75 },
        'EXPLOIT_ADVANTAGE': { Conviction: 20, Resilience: 50 },
        'DELAYED_HONESTY': { Conviction: 50, Composure: 60 },
        'DEEPEN_DECEPTION': { Conviction: 10, Willpower: 30 },
        'RESENTFUL_HONESTY': { Conviction: 70, Willpower: 75, Composure: 65 },
        // Dilemma 15: Allocation Under Scarcity
        'UTILITARIAN_MATH': { Reason: 80, Purpose: 60 },
        'EQUITY_FOCUS': { Purpose: 85, Empathy: 80, Conviction: 80 },
        'EQUAL_SHARE': { Fairness: 75, Conviction: 70 },
        'RELATIONAL_CHOICE': { Resilience: 60, Conviction: 40 },
        'REJECT_FALSE_DILEMMA': { Reason: 85, Innovation: 75, Purpose: 75 },
    };

    const baseDilemmas = [
        { q: "Your team discovers that a colleague has been quietly funneling company resources to help underprivileged communities they grew up in. It's technically illegal, but the work is genuinely helping people. Do you:", options: [ { text: "Report it immediately—rules exist for reasons.", code: "PROCESS_FIRST" }, { text: "Turn a blind eye; they're doing real good and no one's harmed.", code: "IMPACT_OVER_RULES" }, { text: "Talk to them privately first and help them find legal ways to continue.", code: "DIALOGUE_FIRST" }, { text: "Use this knowledge as leverage for personal gain later.", code: "SELF_INTEREST" }, { text: "Report it but recommend they get commended for their intent.", code: "NUANCE_SEEKING" } ] },
        { q: "You're offered a promotion that would triple your salary, but it requires moving to a city where your aging parent lives alone without family nearby. They'll need to go to a facility.", options: [ { text: "Take the promotion; they'll be better cared for in a professional setting anyway.", code: "OPPORTUNITY_FIRST" }, { text: "Refuse the promotion; your presence matters more than money.", code: "PRESENCE_MATTERS" }, { text: "Negotiate with your employer for remote work or try to delay the move.", code: "CREATIVE_SOLUTION" }, { text: "Encourage your parent to move with you; they'd adapt.", code: "CONVINCE_THEM" }, { text: "Accept but feel guilty regardless—there's no perfect answer here.", code: "ACCEPT_PAIN" } ] },
        { q: "You realize your best friend has been subtly undermining your career for years—nothing malicious, just small acts that make sense for their own advancement. They have no idea you've figured it out.", options: [ { text: "End the friendship immediately; trust is non-negotiable.", code: "PURITY_TEST" }, { text: "Keep the friendship but be more cautious with sensitive information.", code: "STRATEGIC_DISTANCE" }, { text: "Confront them directly about what you've observed.", code: "HONEST_CONFRONTATION" }, { text: "Start subtly undermining them in return to level the playing field.", code: "TIT_FOR_TAT" }, { text: "Accept they're human and flawed, like everyone; stay friends but realistic.", code: "MATURE_ACCEPTANCE" } ] },
        { q: "You're a doctor and a patient refuses a life-saving treatment due to their religious beliefs. They have a dependent child. Do you:", options: [ { text: "Respect their autonomy completely; it's their body and choice.", code: "AUTONOMY_ABSOLUTE" }, { text: "Try to convince them; the child's wellbeing is also at stake.", code: "WEIGH_STAKES" }, { text: "Go through legal channels to override their decision for the child's sake.", code: "PROTECT_CHILD" }, { text: "Suggest alternative treatments that align with their beliefs.", code: "BRIDGE_BUILDING" }, { text: "Feel genuinely conflicted and acknowledge you can't choose perfectly.", code: "EMBRACE_CONFLICT" } ] },
        { q: "An old friend asks for a substantial loan they clearly won't be able to repay. They need it for medical treatment. You can afford to lose the money, but you need it for your own goals.", options: [ { text: "Lend it immediately; their health is more important.", code: "COMPASSION_FIRST" }, { text: "Decline; you can't set yourself on fire to keep others warm.", code: "SELF_PRESERVATION" }, { text: "Help them find other resources (grants, payment plans, go-fundme).", code: "ENABLE_AGENCY" }, { text: "Offer to pay for the treatment directly instead of lending money.", code: "PRACTICAL_GENEROSITY" }, { text: "Lend some but set clear expectations about repayment.", code: "BOUNDED_HELP" } ] },
        { q: "You discover your company is doing something legally permissible but environmentally harmful. The decision-makers genuinely believe the benefit outweighs the cost. Do you:", options: [ { text: "Blow the whistle publicly; let others decide based on facts.", code: "TRANSPARENCY_OUTSOURCE" }, { text: "Go to internal leadership and advocate for change from within.", code: "INTERNAL_VOICE" }, { text: "Stay quiet; it's not your decision to make.", code: "ROLE_ACCEPTANCE" }, { text: "Leave the company; you can't work for something you disagree with.", code: "VOTE_WITH_FEET" }, { text: "Try to work within the system while documenting everything.", code: "STRATEGIC_INSIDER" } ] },
        { q: "Your teenage child is struggling with their identity and asks you not to tell anyone yet, but you're worried they need professional support. Do you:", options: [ { text: "Honor their request completely; they'll come to you when ready.", code: "TRUST_TIMELINE" }, { text: "Seek professional guidance quietly and report back to them.", code: "INFORMED_HELP" }, { text: "Tell your partner immediately; you shouldn't carry this alone.", code: "SHARED_BURDEN" }, { text: "Push them to see a therapist; you're worried this is serious.", code: "PARENTAL_OVERRIDE" }, { text: "Listen and support without action; let them lead.", code: "MEET_THEM_THERE" } ] },
        { q: "You witness someone of a different background being treated unfairly. Speaking up might put your own position at risk in a way you can't afford. Do you:", options: [ { text: "Speak up regardless of the cost; some things are more important.", code: "INTEGRITY_OVER_SAFETY" }, { text: "Stay silent; you have your own family to think about.", code: "PROTECT_SELF" }, { text: "Support them privately while maintaining safety publicly.", code: "STRATEGIC_SUPPORT" }, { text: "Document what you see and share it with someone in a position of power.", code: "INDIRECT_ACTION" }, { text: "Later find ways to work against the unfairness systematically.", code: "LONG_GAME" } ] },
        { q: "You're in a position to hire someone. Two candidates are equally qualified. One is from an underrepresented group; one is the nephew of the CEO. Who do you hire?", options: [ { text: "The nephew; relationships matter in business.", code: "NETWORKS_PRACTICAL" }, { text: "The underrepresented candidate; diversity is a priority.", code: "CORRECT_IMBALANCES" }, { text: "Either—qualified is qualified; don't over-think it.", code: "MERIT_NEUTRAL" }, { text: "Find a way to hire both; there must be budget somewhere.", code: "SOLVE_CREATIVELY" }, { text: "Choose the underrepresented candidate but feel guilty about the nephew's feelings.", code: "ACKNOWLEDGE_HARM" } ] },
        { q: "Your research could help millions, but it requires using data that was collected unethically in the past. No new harm would come from using it. Do you:", options: [ { text: "Use it; the potential benefit justifies the past harm.", code: "UTILITARIAN_USE" }, { text: "Refuse; using it perpetuates the original wrong.", code: "PRINCIPLE_OVER_BENEFIT" }, { text: "Use it but dedicate resources to addressing the original harm.", code: "REDEMPTIVE_USE" }, { text: "Only use it with explicit consent from affected communities.", code: "CONSENT_SEEKING" }, { text: "Find alternative data even if it takes longer.", code: "INTEGRITY_SLOWER" } ] },
        { q: "A family member confesses to you that they committed a crime years ago that hurt someone. They've changed, but the victim still doesn't know. Do you:", options: [ { text: "Tell them to confess; the victim deserves to know.", code: "TRUTH_ABSOLUTE" }, { text: "Encourage them to work toward restitution without full confession.", code: "REDEMPTION_PATH" }, { text: "Keep the secret; they've changed and confessing now just causes new pain.", code: "LET_PAST_REST" }, { text: "Suggest they tell the victim themselves and support them in it.", code: "GUIDED_HONESTY" }, { text: "Feel genuinely torn; there's genuine weight on both sides.", code: "NO_CLEAN_ANSWER" } ] },
        { q: "You're in a group where everyone agrees with an idea except you, and speaking up would make you look difficult. The idea isn't harmful, just not optimal. Do you:", options: [ { text: "Speak up; the group needs all perspectives.", code: "VOICE_ALWAYS" }, { text: "Stay quiet; harmony matters and you could be wrong anyway.", code: "DEFER_TO_GROUP" }, { text: "Raise concerns privately with the leader afterward.", code: "PRIVATE_DISSENT" }, { text: "Share your perspective but frame it as a question, not a statement.", code: "GENTLE_CHALLENGE" }, { text: "Build a coalition before speaking; you need allies first.", code: "STRATEGIC_ALLIES" } ] },
        { q: "Someone you love is heading toward a decision that will likely hurt them deeply. You see it coming but they don't. They don't want unsolicited advice. Do you:", options: [ { text: "Tell them anyway; you can't watch them fail silently.", code: "BREAK_BOUNDARY" }, { text: "Respect their autonomy completely; it's their lesson to learn.", code: "HANDS_OFF" }, { text: "Ask permission to share your perspective first.", code: "SEEK_PERMISSION" }, { text: "Plant seeds of doubt through questions rather than statements.", code: "GENTLE_NUDGE" }, { text: "Let them choose, but be there for them when it goes wrong.", code: "SUPPORT_ONLY" } ] },
        { q: "You discover an error in your favor—financially or professionally. Nobody has noticed yet. Fixing it voluntarily costs you significantly. Do you:", options: [ { text: "Fix it immediately; it's the right thing to do.", code: "INTEGRITY_AUTOMATIC" }, { text: "Keep the advantage; everyone has blind spots, not your responsibility.", code: "EXPLOIT_ADVANTAGE" }, { text: "Wait a reasonable time then mention it casually.", code: "DELAYED_HONESTY" }, { text: "Try to hide it better before someone finds it.", code: "DEEPEN_DECEPTION" }, { text: "Feel conflicted and probably fix it but resent having to.", code: "RESENTFUL_HONESTY" } ] },
        { q: "You have power to help multiple groups, but resources are limited and priorities conflict. Each choice helps one group but disadvantages another. Do you:", options: [ { text: "Choose the mathematically largest impact; numbers don't lie.", code: "UTILITARIAN_MATH" }, { text: "Help the most marginalized; justice is about evening scales.", code: "EQUITY_FOCUS" }, { text: "Distribute equally even if it means suboptimal results.", code: "EQUAL_SHARE" }, { text: "Choose based on who asked first or who you know best.", code: "RELATIONAL_CHOICE" }, { text: "Try to find a creative solution that doesn't require choosing.", code: "REJECT_FALSE_DILEMMA" } ] }
    ];
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
    
    useEffect(() => { 
        if (idx < baseDilemmas.length) setShuffledOptions(shuffleArray(baseDilemmas[idx].options)); 
    }, [idx]);

    // Calculate consistency between related dilemmas
    const calculateConsistency = (newAnswers: string[]) => {
        // Map dilemmas to value dimensions
        const valuePatterns: Record<string, string[]> = {
            'integrity': ['INTEGRITY_OVER_SAFETY', 'INTEGRITY_AUTOMATIC', 'PRINCIPLE_OVER_BENEFIT', 'TRUTH_ABSOLUTE'],
            'pragmatism': ['STRATEGIC_DISTANCE', 'PRACTICAL_GENEROSITY', 'STRATEGIC_INSIDER', 'STRATEGIC_ALLIES'],
            'empathy': ['COMPASSION_FIRST', 'EMPATHY_85+', 'PRESENCE_MATTERS', 'MEET_THEM_THERE']
        };
        
        const consistencyScore: Record<string, number> = {};
        for (const [dimension, codes] of Object.entries(valuePatterns)) {
            const matches = newAnswers.filter(code => codes.includes(code)).length;
            consistencyScore[dimension] = (matches / codes.length) * 100;
        }
        
        return consistencyScore;
    };

    // Calculate confidence intervals for substat scores
    const calculateConfidenceIntervals = (substatScores: Record<string, number[]>) => {
        const ci: Record<string, { mean: number; margin: number; low: number; high: number }> = {};
        
        for (const [substat, scores] of Object.entries(substatScores)) {
            const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
            const variance = scores.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / scores.length;
            const stdDev = Math.sqrt(variance);
            // 95% CI: ±1.96 * (stdDev / sqrt(n))
            const margin = scores.length > 1 ? 1.96 * (stdDev / Math.sqrt(scores.length)) : 10;
            
            ci[substat] = {
                mean,
                margin,
                low: Math.max(0, mean - margin),
                high: Math.min(100, mean + margin)
            };
        }
        
        return ci;
    };

    const handleSelect = (code: string) => {
        const newAnswers = [...answers, code];
        if (idx >= baseDilemmas.length - 1) {
            // Score all dilemma answers
            const substatScores: Record<string, number[]> = {};
            
            newAnswers.forEach(answerCode => {
                const mapping = answerSubstatMap[answerCode] || {};
                Object.entries(mapping).forEach(([substat, score]) => {
                    if (!substatScores[substat]) substatScores[substat] = [];
                    substatScores[substat].push(score);
                });
            });
            
            // Average scores for each substat
            const avgScores: Record<string, number> = {};
            Object.entries(substatScores).forEach(([substat, scores]) => {
                avgScores[substat] = scores.reduce((a, b) => a + b, 0) / scores.length;
            });
            
            // Calculate consistency & confidence intervals
            const consistency = calculateConsistency(newAnswers);
            const confidenceIntervals = calculateConfidenceIntervals(substatScores);
            
            // Build value profile based on high-scoring substats
            const valueProfile: Record<string, string> = {};
            const sortedScores = Object.entries(avgScores).sort((a, b) => b[1] - a[1]);
            
            // Map top substats to value dimensions
            const valueMapping: Record<string, string> = {
                'Conviction': 'Integrity-driven',
                'Purpose': 'Purpose-oriented',
                'Empathy': 'Compassionate',
                'Resilience': 'Resilient',
                'Charisma': 'Charismatic',
                'Reason': 'Rational/Analytical',
            };
            
            const topValues = sortedScores.slice(0, 3).map(([substat, score]) => `${valueMapping[substat] || substat} (${Math.round(score)}%)`);
            const primaryProfile = topValues.join(' + ') || 'Balanced';
            
            // Detect outliers (low conviction, high empathy, etc. = certain archetypes)
            const lowConviction = avgScores.Conviction < 40;
            const highEmpathy = avgScores.Empathy > 70;
            const highReason = avgScores.Reason > 70;
            
            let archetype = 'Balanced Pragmatist';
            if (highEmpathy && lowConviction) archetype = 'Empathic Relativist';
            if (highEmpathy && !lowConviction) archetype = 'Compassionate Idealist';
            if (highReason && lowConviction) archetype = 'Skeptical Analyst';
            if (highReason && !lowConviction) archetype = 'Principled Strategist';
            
            onComplete({ 
                spiritDilemmas: newAnswers,
                dilemmaScores: avgScores,
                dilemmaConsistency: consistency,
                dilemmaConfidence: confidenceIntervals,
                valueProfile: {
                    topValues,
                    primaryProfile,
                    archetype
                }
            });
        } else { 
            setAnswers(newAnswers); 
            setIdx(idx + 1); 
        }
    };
    return (
        <TerminalShell title="Moral Architecture // Spirit Calibration">
            <div className="flex flex-col items-center py-2 text-center flex-grow gap-4">
                <Scales className="text-purple-500 flex-shrink-0" size={28} />
                
                {/* Progress indicator - responsive */}
                <div className="mb-2 flex justify-center gap-0.5 flex-wrap">
                    {Array.from({ length: baseDilemmas.length }).map((_, i) => (
                        <div key={i} className={`rounded-full transition-all ${i <= idx ? 'bg-purple-500 shadow-[0_0_30px_#a855f7] w-2 h-2' : 'bg-gray-800 w-1.5 h-1.5'}`} />
                    ))}
                </div>
                
                {/* Question text - responsive sizing */}
                <div className="flex-grow flex flex-col justify-center w-full px-2 sm:px-4">
                    <p className="text-xs sm:text-sm lg:text-base text-white font-serif italic mb-4 sm:mb-6 leading-relaxed">
                        "{baseDilemmas[idx].q}"
                    </p>
                    
                    {/* Options - responsive grid */}
                    <div className="w-full space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[300px] sm:max-h-[350px] pr-2 custom-scrollbar">
                        {shuffledOptions.map(opt => (
                            <button 
                                key={opt.code} 
                                onClick={() => handleSelect(opt.code)} 
                                className="w-full bg-gray-900/40 border border-gray-800 p-2 sm:p-3 text-gray-300 hover:text-white hover:border-purple-500 active:bg-purple-600/40 transition-all font-bold uppercase tracking-widest text-[7px] sm:text-[9px] text-left flex justify-between items-start group rounded-sm"
                            >
                                <span className="flex-grow pr-2 text-left leading-tight">{opt.text}</span>
                                <ChevronRight size={12} className="opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </TerminalShell>
    );
};

// --- ENGINE: SYSTEM EQUILIBRIUM (SYSTEMIC REASONING) ---
const EquilibriumReasoningTask: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    // Advanced reasoning question bank - IQ-based, multi-domain
    const reasoningQuestions: Record<number, any[]> = {
        20: [ // Percentile 80+ (easiest 20%) - EXPANDED
            { text: "If all mammals have fur and dogs are mammals, do dogs have fur?", options: ["No", "Yes", "Maybe", "Unclear"], correct: 1, domain: "Logic" },
            { text: "3 + 5 × 2 = ?", options: ["16", "13", "11", "20"], correct: 1, domain: "Math" },
            { text: "Sunrise is to east as sunset is to...?", options: ["North", "South", "West", "Up"], correct: 2, domain: "Analogy" },
            { text: "2 + 2 = ?", options: ["3", "4", "5", "6"], correct: 1, domain: "Math" },
            { text: "Which is bigger: 10 or 5?", options: ["5", "10", "Same", "Cannot tell"], correct: 1, domain: "Logic" },
            { text: "If I have 3 apples and give away 1, how many do I have left?", options: ["1", "2", "3", "4"], correct: 1, domain: "Logic" },
            { text: "What color is the sky on a clear day?", options: ["Red", "Blue", "Green", "Yellow"], correct: 1, domain: "Logic" },
            { text: "Is ice hot or cold?", options: ["Hot", "Cold", "Warm", "Neither"], correct: 1, domain: "Logic" },
            { text: "5 × 2 = ?", options: ["7", "10", "12", "15"], correct: 1, domain: "Math" },
            { text: "Teacher is to school as doctor is to...?", options: ["Hospital", "Patient", "Medicine", "Disease"], correct: 0, domain: "Analogy" },
            { text: "Which doesn't belong: Apple, Banana, Carrot, Orange?", options: ["Apple", "Banana", "Carrot", "Orange"], correct: 2, domain: "Logic" },
            { text: "1 + 1 + 1 = ?", options: ["2", "3", "4", "5"], correct: 1, domain: "Math" },
            { text: "What comes next: A, B, C, ?", options: ["D", "E", "F", "G"], correct: 0, domain: "Logic" },
            { text: "Pen is to writing as brush is to...?", options: ["Drawing", "Painting", "Color", "Canvas"], correct: 0, domain: "Analogy" },
            { text: "8 - 3 = ?", options: ["4", "5", "6", "7"], correct: 1, domain: "Math" },
        ],
        35: [ // Percentile 65% - EXPANDED
            { text: "A bag contains red, blue, and green balls in equal quantities. What's the probability of drawing red twice without replacement?", options: ["1/6", "1/9", "1/3", "2/9"], correct: 0, domain: "Probability" },
            { text: "Which number doesn't belong: 2, 3, 5, 7, 9, 11?", options: ["7", "9", "11", "2"], correct: 1, domain: "Logic" },
            { text: "If A leads B and C lags B, then...?", options: ["A leads C", "C leads A", "All equal", "Cannot determine"], correct: 0, domain: "Logic" },
            { text: "If all cats are animals, and Fluffy is a cat, then Fluffy is an...?", options: ["Plant", "Animal", "Rock", "Color"], correct: 1, domain: "Logic" },
            { text: "A bat and ball cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$0.15", "$0.20"], correct: 1, domain: "Math" },
            { text: "If the day after tomorrow is Thursday, what day is today?", options: ["Monday", "Tuesday", "Wednesday", "Friday"], correct: 2, domain: "Logic" },
            { text: "John is taller than Mary. Mary is taller than Steve. Who is tallest?", options: ["John", "Mary", "Steve", "Cannot tell"], correct: 0, domain: "Logic" },
            { text: "What comes next: 2, 4, 6, 8, ?", options: ["9", "10", "11", "12"], correct: 1, domain: "Logic" },
            { text: "What is 50% of 80?", options: ["30", "40", "50", "60"], correct: 1, domain: "Math" },
            { text: "If all squares are rectangles, is a rectangle a square?", options: ["Yes", "No", "Always", "Sometimes"], correct: 1, domain: "Logic" },
            { text: "What is 12 × 5?", options: ["50", "60", "70", "80"], correct: 1, domain: "Math" },
            { text: "If 2x = 10, what is x?", options: ["3", "5", "7", "10"], correct: 1, domain: "Math" },
            { text: "Three boxes: one has apples, one has oranges, one has both. All labels are wrong. You pick one apple from 'both' box. What's in oranges box?", options: ["Oranges", "Apples", "Both", "Cannot determine"], correct: 1, domain: "Logic" },
            { text: "What is 100 - 25?", options: ["70", "75", "80", "85"], correct: 1, domain: "Math" },
            { text: "If A=1, B=2, what is D?", options: ["3", "4", "5", "6"], correct: 1, domain: "Logic" },
        ],
        50: [ // Percentile 50% (median) - EXPANDED
            { text: "Sophie's parents have three children: April, May, and...?", options: ["June", "Sophie", "Not enough info", "August"], correct: 1, domain: "Lateral" },
            { text: "What is 27^(2/3)?", options: ["3", "9", "81", "27"], correct: 1, domain: "Math" },
            { text: "If X is inversely proportional to Y and X=5 when Y=4, what is X when Y=2?", options: ["2.5", "10", "5", "8"], correct: 1, domain: "Math" },
            { text: "Which is the most logical conclusion? All birds lay eggs. Penguins are birds.", options: ["Penguins lay eggs", "Not all birds lay eggs", "Eggs are round", "Some birds fly"], correct: 0, domain: "Logic" },
            { text: "In a room of 23 people, what's the approximate probability two share a birthday?", options: ["About 10%", "About 25%", "About 50%", "About 75%"], correct: 2, domain: "Probability" },
            { text: "If all Zorps are Blips, and some Blips are Clonks, what must be true?", options: ["All Zorps are Clonks", "Some Zorps might be Clonks", "No Zorps are Clonks", "Cannot determine"], correct: 1, domain: "Logic" },
            { text: "A train leaves at 60 mph. Another leaves 2 hours later at 90 mph. When does it catch up?", options: ["3 hours", "4 hours", "5 hours", "6 hours"], correct: 1, domain: "Math" },
            { text: "What is the next number: 1, 1, 2, 3, 5, 8, ?", options: ["13", "12", "11", "10"], correct: 0, domain: "Logic" },
            { text: "If you have a 3-gallon and 5-gallon jug, how do you measure 4 gallons?", options: ["Fill 3, pour into 5, refill 3, pour 1 more", "Impossible", "Fill 5, pour 1 into 3", "Fill both"], correct: 0, domain: "Logic" },
            { text: "What is √144?", options: ["10", "12", "14", "16"], correct: 1, domain: "Math" },
            { text: "If p=0.5 and q=0.3 are independent, what's P(p AND q)?", options: ["0.8", "0.65", "0.15", "0.08"], correct: 2, domain: "Probability" },
            { text: "What is 15% of 200?", options: ["20", "30", "40", "50"], correct: 1, domain: "Math" },
            { text: "If the pattern is 1, 4, 9, 16, what's next?", options: ["20", "25", "30", "36"], correct: 1, domain: "Logic" },
            { text: "What is 2^5?", options: ["16", "32", "64", "128"], correct: 1, domain: "Math" },
            { text: "If A>B and B>C, what can we conclude?", options: ["A>C", "C>A", "A=C", "Cannot determine"], correct: 0, domain: "Logic" },
        ],
        65: [ // Percentile 35% - EXPANDED
            { text: "A clock is 8 minutes slow and loses 30 seconds per hour. In how many hours will it show the correct time again?", options: ["512 hrs", "480 hrs", "16 hrs", "32 hrs"], correct: 1, domain: "Math" },
            { text: "In cryptarithmetic SEND+MORE=MONEY, what is M?", options: ["1", "2", "8", "9"], correct: 0, domain: "Logic" },
            { text: "If the nth term of a sequence is n² + 2n + 1, what is the 10th term?", options: ["121", "130", "100", "144"], correct: 0, domain: "Math" },
            { text: "A man is in a locked room with only a piano. How does he escape?", options: ["Play middle C", "Use C sharp key", "Pick the lock", "Move the piano"], correct: 1, domain: "Lateral" },
            { text: "How many squares are in a 4x4 grid (all sizes)?", options: ["16", "30", "40", "64"], correct: 1, domain: "Logic" },
            { text: "What is the derivative of x^3?", options: ["3x^2", "x^2", "3x", "x^3/3"], correct: 0, domain: "Calculus" },
            { text: "If 3x + 4 = 16, what is x?", options: ["2", "3", "4", "5"], correct: 2, domain: "Math" },
            { text: "What is log₁₀(1000)?", options: ["1", "2", "3", "4"], correct: 2, domain: "Math" },
            { text: "If A implies B and B implies C, does A imply C?", options: ["Yes", "No", "Sometimes", "Cannot determine"], correct: 0, domain: "Logic" },
            { text: "What is 7!  (factorial)?", options: ["840", "2520", "5040", "7"], correct: 2, domain: "Math" },
            { text: "Person born 1900, died 1950. How many days?", options: ["18,250", "18,262", "18,263", "18,275"], correct: 2, domain: "Logic" },
            { text: "What is the Monty Hall problem solution?", options: ["Always stay", "Always switch", "Doesn't matter", "50/50"], correct: 1, domain: "Logic" },
            { text: "If f(x)=2x² what is f(3)?", options: ["12", "18", "24", "36"], correct: 1, domain: "Math" },
            { text: "What is sin(90°)?", options: ["0", "1", "-1", "undefined"], correct: 1, domain: "Math" },
            { text: "In formal logic, what is a tautology?", options: ["A contradiction", "Always true", "Sometimes false", "Unprovable"], correct: 1, domain: "Logic" },
        ],
        80: [ // Percentile 20% (hardest 20%) - EXPANDED
            { text: "In a system of equations where 3x + 4y = 20 and 2x - 3y = 1, solve for x.", options: ["4", "3", "2", "5"], correct: 0, domain: "Math" },
            { text: "What is the 6th term in: 1, 1, 2, 6, 24, ...?", options: ["120", "144", "720", "240"], correct: 2, domain: "Logic" },
            { text: "Gödel's incompleteness theorem suggests...?", options: ["All truths provable", "Some truths unprovable", "Math contradictory", "Logic circular"], correct: 1, domain: "Meta" },
            { text: "If f(x) = 2x³ - 5x² + 4x - 1, what is f'(2)?", options: ["8", "12", "20", "15"], correct: 2, domain: "Calculus" },
            { text: "In modal logic, what does ◇P ∧ ¬◇Q imply?", options: ["P possible, Q necessary", "P possible, Q not necessary", "P necessary, Q possible", "Cannot determine"], correct: 1, domain: "Logic" },
            { text: "What is the limit of (x²-1)/(x-1) as x→1?", options: ["0", "1", "2", "undefined"], correct: 2, domain: "Calculus" },
            { text: "If ∑(n=1 to ∞) 1/n² = π²/6, what is this series?", options: ["Basel problem", "Riemann zeta", "Euler product", "All above"], correct: 3, domain: "Math" },
            { text: "In Peano axioms, what defines natural numbers?", options: ["Set theory", "Successor function", "Infinity axiom", "Both B&C"], correct: 3, domain: "Logic" },
            { text: "What is the cardinality of the continuum?", options: ["ℵ₀", "ℵ₁", "c", "undefined"], correct: 2, domain: "Math" },
            { text: "Cantor's diagonal argument proves what?", options: ["Reals countable", "Reals uncountable", "Integers finite", "All equal"], correct: 1, domain: "Logic" },
            { text: "What is the P vs NP problem status?", options: ["Solved P=NP", "Solved P≠NP", "Unsolved", "Undecidable"], correct: 2, domain: "Logic" },
            { text: "In ZFC set theory, what is a proper class?", options: ["Finite set", "Too big for ZFC", "Empty set", "Null class"], correct: 1, domain: "Logic" },
            { text: "What is a Godel number?", options: ["Prime number", "Encoding of formula", "Transcendental", "Random"], correct: 1, domain: "Logic" },
            { text: "If x² + y² = z², what is this?", options: ["Linear equation", "Circle", "Pythagorean triple", "Fermat equation"], correct: 2, domain: "Math" },
            { text: "What does Church's thesis state?", options: ["God exists", "Computability equivalence", "Logic complete", "Continuum real"], correct: 1, domain: "Logic" },
        ],
    };

    const [difficulty, setDifficulty] = useState(50);
    const [round, setRound] = useState(1);
    const [history, setHistory] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [phase, setPhase] = useState<'briefing' | 'active' | 'feedback'>('briefing');
    const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
    const TOTAL_ROUNDS = 15;

    const fetchNextQuestion = (currDiff: number, currHist: any[]) => {
        setLoading(true);
        const usedQuestions = currHist.map(h => h.text);
        
        // Find closest difficulty level
        const diffLevels = [20, 35, 50, 65, 80];
        const closestDiff = diffLevels.reduce((prev, curr) => 
            Math.abs(curr - currDiff) < Math.abs(prev - currDiff) ? curr : prev
        );
        
        const questionBank = reasoningQuestions[closestDiff] || reasoningQuestions[50];
        const availableQuestions = questionBank.filter(q => !usedQuestions.includes(q.text));
        const q = availableQuestions.length > 0 
            ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
            : questionBank[Math.floor(Math.random() * questionBank.length)];
        
        // Shuffle answer options to avoid "always B" bias
        const shuffledOptions = shuffleArray([...q.options]);
        const newCorrectIdx = shuffledOptions.indexOf(q.options[q.correct]);
        
        setCurrentQ({ ...q, options: shuffledOptions, correct: newCorrectIdx });
        setSelectedOption(null);
        setLoading(false);
    };

    const handleStart = () => { 
        setPhase('active'); 
        fetchNextQuestion(difficulty, history); 
    };

    const handleAnswer = (optionIndex: number) => {
        if (phase === 'feedback') return;
        
        setSelectedOption(optionIndex);
        const isCorrect = optionIndex === currentQ.correct;
        setLastCorrect(isCorrect);
        setPhase('feedback');
        
        const newHistory = [...history, { 
            q: currentQ.text, 
            selectedIdx: optionIndex,
            correct: isCorrect, 
            diff: difficulty 
        }];
        setHistory(newHistory);
        
        setTimeout(() => {
            if (round >= TOTAL_ROUNDS) {
                // Final score: the equilibrium difficulty represents user's percentile
                // difficulty=20 means user answers like 80% of population (easy) = low score
                // difficulty=80 means user answers like 20% of population (hard) = high score
                const correctCnt = newHistory.filter(h => h.correct).length;
                const finalScore = 100 - difficulty;
                onComplete({ 
                    reasoningScore: finalScore, 
                    history: newHistory, 
                    finalDifficulty: difficulty,
                    correctAnswers: correctCnt,
                    totalAttempts: TOTAL_ROUNDS
                });
            } else {
                // FIXED ADAPTIVE LOGIC:
                // difficulty = percentile (% who can answer correctly)
                // Higher difficulty% = easier question (more people know it)
                // Lower difficulty% = harder question (fewer people know it)
                // If correct on easy (high%), ask harder (decrease %)
                // If wrong on hard (low%), ask easier (increase %)
                const step = Math.max(3, 25 / (round + 0.5));
                const nextDiff = isCorrect 
                    ? Math.max(15, difficulty - step)  // FIXED: Correct = DECREASE % = harder next
                    : Math.min(85, difficulty + step); // FIXED: Wrong = INCREASE % = easier next
                
                setDifficulty(nextDiff);
                setRound(r => r + 1);
                setPhase('active');
                fetchNextQuestion(nextDiff, newHistory);
            }
        }, 2000);
    };

    if (phase === 'briefing') return (
        <TerminalShell title="Cognitive Architecture // Systemic Reasoning">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-8 sm:py-12 space-y-6 sm:space-y-8">
                <BrainCircuit className="w-16 sm:w-20 h-16 sm:h-20 text-purple-500 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-black font-orbitron text-white uppercase tracking-[0.2em]">LOGIC REASONING CALIBRATION</h2>
                <div className="bg-gray-900/40 p-4 sm:p-6 border border-gray-800 rounded-sm max-w-sm text-left text-xs sm:text-sm space-y-3">
                    <p className="text-gray-400 font-mono"><span className="text-cyan-400 font-bold">Protocol:</span> {TOTAL_ROUNDS} questions testing logic, math, pattern recognition, and reasoning.</p>
                    <p className="text-gray-500 font-mono italic text-[10px] sm:text-xs">"Answer each question as best you can. Your complete reasoning profile will be revealed in your final dossier."</p>
                </div>
                <button onClick={handleStart} className="btn-primary w-full max-w-xs font-orbitron tracking-[0.3em] py-4 sm:py-5 uppercase text-xs sm:text-sm">BEGIN CALIBRATION</button>
            </div>
        </TerminalShell>
    );

    if (loading || !currentQ) return <TerminalShell title="Reasoning Matrix // Loading"><Loader text="PREPARING QUESTION..." /></TerminalShell>;

    return (
        <TerminalShell title={`Reasoning Matrix // Question ${round}/${TOTAL_ROUNDS}`}>
            <div className="flex flex-col h-full justify-center gap-4 sm:gap-6">
                {/* Question */}
                <div className="flex-grow flex flex-col justify-center">
                    <p className="text-base sm:text-lg lg:text-xl text-white font-serif italic leading-relaxed px-2 text-center mb-6 sm:mb-8">
                        "{currentQ.text}"
                    </p>

                    {/* Options */}
                    <div className="space-y-2 sm:space-y-3">
                        {currentQ.options.map((option: string, idx: number) => {
                            const isSelected = selectedOption === idx;
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={phase === 'feedback'}
                                    className={`w-full border p-2 sm:p-4 rounded-sm text-left flex items-center gap-2 sm:gap-3 transition-all text-xs sm:text-sm font-mono font-bold uppercase tracking-widest ${
                                        phase === 'feedback'
                                            ? isSelected
                                                ? 'bg-gray-900/40 border-gray-700 text-gray-400'
                                                : 'bg-gray-900/40 border-gray-700 text-gray-400'
                                            : 'bg-gray-900/80 border-gray-700 text-gray-300 hover:bg-purple-600/40 hover:border-purple-400 hover:text-white active:bg-purple-600/60'
                                    }`}
                                >
                                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded border flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </TerminalShell>
    );
};

const HobbySelection: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const sortedHobbies = useMemo(() => [...HOBBY_LIST].sort((a, b) => a.name.localeCompare(b.name)), []);
    const toggleHobby = (hobbyName: string) => {
        if (selected.includes(hobbyName)) setSelected(prev => prev.filter(h => h !== hobbyName));
        else if (selected.length < 10) setSelected(prev => [...prev, hobbyName]);
    };
    return (
        <TerminalShell title="Behavioral Profiling // Interest Acquisition">
            <h2 className="text-sm font-orbitron mb-6 text-purple-400 uppercase tracking-widest text-center">SELECT UP TO 10 CORE INTERESTS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 mb-6 sm:mb-8 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 custom-scrollbar w-full">
                {sortedHobbies.map(h => (
                    <button key={h.name} onClick={() => toggleHobby(h.name)} className={`p-2 sm:p-3 border rounded-sm text-[7px] sm:text-[10px] text-left uppercase font-mono tracking-tighter transition-all ${selected.includes(h.name) ? 'bg-purple-950 border-purple-400 text-white' : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'}`}>{h.name}</button>
                ))}
            </div>
            <button onClick={() => onComplete({ hobbies: selected })} className="w-full bg-white text-black font-black font-orbitron py-3 sm:py-4 tracking-[0.2em] rounded-sm transition-all flex-shrink-0 text-xs sm:text-sm">VERIFY & PROCEED</button>
        </TerminalShell>
    );
};

// --- ENGINE: NEURAL DIVERGENCE (CREATIVE PROTOCOL) ---
// 5-prompt assessment system: Imagination, Innovation, Style, Vision, Expression
const CreativeProtocolTest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [phase, setPhase] = useState<'briefing' | 'active' | 'complete'>('briefing');
    const [response, setResponse] = useState('');
    const [timeLeft, setTimeLeft] = useState(90);
    const timerRef = useRef<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Focus Forest tracking
    const [focusGrowth, setFocusGrowth] = useState(0); // 0-100 growth progress
    const [totalFocusScore, setTotalFocusScore] = useState(0);
    const [focusInterruptions, setFocusInterruptions] = useState(0);
    const [lastInputTime, setLastInputTime] = useState<number>(0);
    const [focusStreak, setFocusStreak] = useState(true);
    const lastInputRef = useRef<number>(Date.now());
    const appVisibilityRef = useRef<boolean>(true);

    const currentPrompt = CREATIVITY_ASSESSMENT_PROMPTS[currentPromptIndex];
    const totalPrompts = CREATIVITY_ASSESSMENT_PROMPTS.length;
    const isLastPrompt = currentPromptIndex === totalPrompts - 1;
    
    // Detect app backgrounding
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            appVisibilityRef.current = isVisible;
            if (!isVisible && phase === 'active') {
                setFocusInterruptions(prev => prev + 1);
                setFocusStreak(false);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [phase]);

    // Timer management - no artificial focus growth
    useEffect(() => {
        if (phase === 'active' && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        handlePromptComplete();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase, response]);

    // Auto-focus textarea
    useEffect(() => {
        if (phase === 'active') {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [phase]);

    const handleTextChange = (text: string) => {
        setResponse(text);
        lastInputRef.current = Date.now();
        // Track focus: only reward meaningful content milestones
        // +5 per 50 words (instead of per keystroke)
        const prevWordCount = getWordCount(responses[currentPrompt.id]?.text || '');
        const newWordCount = getWordCount(text);
        if (newWordCount > prevWordCount && newWordCount % 50 === 0) {
            setFocusGrowth(prev => Math.min(100, prev + 5));
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setPhase('active');
        setTimeLeft(90);
        setFocusGrowth(0);
        setFocusStreak(true);
        lastInputRef.current = Date.now();
    };

    const handlePromptComplete = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Save response WITHOUT mechanical scoring (will be scored by LLM)
        const wordCount = getWordCount(response);
        const timeUsed = 90 - timeLeft;
        
        const newResponses = { 
            ...responses, 
            [currentPrompt.id]: {
                text: response.trim(),
                wordCount,
                timeUsed,
                hasInterruptions: !focusStreak,
                promptDefinition: currentPrompt.definition
            }
        };
        setResponses(newResponses);
        
        if (isLastPrompt) {
            // All prompts complete - prepare for LLM analysis
            setPhase('complete');
            setTimeout(() => {
                // Initialize with baseline scores (will be overwritten by LLM)
                const creativitySubscores: Record<string, number> = {
                    'Imagination': 50,
                    'Innovation': 50,
                    'Style': 50,
                    'Expression': 50,
                    'Vision': 50
                };
                
                onComplete({ 
                    creativityResponse: newResponses,
                    creativityScores: creativitySubscores, // Placeholder - LLM will score
                    focusMetrics: {
                        interruptions: focusInterruptions,
                        focusStreakBonus: focusStreak
                    },
                    needsLLMAnalysis: true // Flag to trigger LLM scoring
                });
            }, 2000);
        } else {
            // Move to next prompt
            setCurrentPromptIndex(prev => prev + 1);
            setResponse('');
            setTimeLeft(90);
            setFocusGrowth(0);
            setFocusStreak(true);
            setPhase('briefing');
        }
    };

    const getWordCount = (text: string) => text.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Tree growth visualization
    const getTreeStage = (growth: number) => {
        if (growth < 20) return { name: 'SEED', emoji: '🌱', height: 'h-4', color: 'text-amber-700' };
        if (growth < 40) return { name: 'SPROUT', emoji: '🌿', height: 'h-8', color: 'text-green-600' };
        if (growth < 60) return { name: 'SAPLING', emoji: '🌲', height: 'h-12', color: 'text-green-500' };
        if (growth < 85) return { name: 'TREE', emoji: '🌳', height: 'h-16', color: 'text-green-400' };
        return { name: 'ANCIENT GROVE', emoji: '🌲🌳🌲', height: 'h-20', color: 'text-emerald-300' };
    };

    const treeStage = getTreeStage(focusGrowth);

    const getSubstatIcon = (substat: string) => {
        const iconMap: Record<string, any> = {
            'Imagination': <Sparkles size={10} />,
            'Innovation': <Lightbulb size={10} />,
            'Style': <Palette size={10} />,
            'Expression': <PenTool size={10} />,
            'Vision': <Eye size={10} />
        };
        return iconMap[substat];
    };

    const getSubstatColor = (substat: string) => {
        const colorMap: Record<string, string> = {
            'Imagination': 'text-pink-400',
            'Innovation': 'text-yellow-400',
            'Style': 'text-purple-400',
            'Expression': 'text-cyan-400',
            'Vision': 'text-emerald-400'
        };
        return colorMap[substat];
    };

    // Briefing screen
    if (phase === 'briefing') return (
        <TerminalShell title="Neural Divergence // Creativity Matrix" accentClass="border-amber-600/50">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-4 sm:py-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-full">
                <Wand2 className="w-12 sm:w-16 h-12 sm:h-16 text-amber-500 animate-pulse flex-shrink-0" />
                <h2 className="text-lg sm:text-2xl font-black font-orbitron text-amber-400 uppercase tracking-[0.2em] flex-shrink-0">CREATIVITY CALIBRATION</h2>
                
                <div className="text-xs sm:text-sm font-mono text-amber-400 font-bold flex-shrink-0">
                    PROMPT {currentPromptIndex + 1} / {totalPrompts}
                </div>
                
                <div className="bg-gray-900/40 p-3 sm:p-6 border border-amber-900/30 rounded-sm max-w-2xl text-left space-y-3 sm:space-y-4 flex-shrink-0">
                    <div className="space-y-2">
                        <h3 className="text-amber-400 font-bold font-orbitron uppercase tracking-widest text-sm sm:text-base">
                            {currentPrompt.substat}
                        </h3>
                        <p className="text-gray-300 italic text-xs sm:text-sm">{currentPrompt.definition}</p>
                    </div>
                    
                    <div className="bg-black/40 border border-gray-700 p-3 sm:p-4 rounded">
                        <p className="text-white font-serif text-sm sm:text-base leading-relaxed">
                            "{currentPrompt.prompt}"
                        </p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                        <p className="text-[8px] sm:text-[9px] text-gray-500 italic">
                            You have 90 seconds per prompt. Be honest and thoughtful.
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={handleStart} 
                    className="w-full max-w-xs bg-amber-600 hover:bg-amber-500 text-black font-black font-orbitron py-4 sm:py-5 px-4 rounded-sm tracking-[0.3em] uppercase text-xs sm:text-sm transition-all flex-shrink-0 mb-4"
                >
                    BEGIN
                </button>
            </div>
        </TerminalShell>
    );

    // Complete screen
    if (phase === 'complete') return (
        <TerminalShell title="Neural Divergence // Complete" accentClass="border-amber-600/50">
            <div className="flex flex-col items-center justify-center flex-grow py-12 space-y-4">
                <Check className="w-16 h-16 text-green-500" />
                <h2 className="text-xl font-black font-orbitron text-green-400 uppercase tracking-widest">CREATIVITY ASSESSMENT COMPLETE</h2>
                <p className="text-gray-500 font-mono text-xs">Central is analyzing your creative signature across all dimensions...</p>
            </div>
        </TerminalShell>
    );

    // Active prompt screen    
    return (
        <TerminalShell 
            title={`Neural Divergence // Prompt ${currentPromptIndex + 1}/${totalPrompts}`}
            accentClass="border-amber-600/50"
        >
            <div className="flex flex-col h-full">
                {/* Timer Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
                    <span className="text-xs text-gray-600 font-mono">
                        {currentPrompt.substat}
                    </span>
                    <span className={`font-mono text-2xl font-bold ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Prompt Header */}
                <div className="bg-amber-500/10 border border-amber-500 rounded-sm p-5 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Wand2 size={20} className="text-amber-400" />
                        <span className="text-sm font-black font-orbitron text-amber-400 uppercase tracking-widest">
                            {currentPrompt.substat}
                        </span>
                    </div>
                    <p className="text-white font-serif italic text-base leading-relaxed">
                        "{currentPrompt.prompt}"
                    </p>
                </div>

                {/* Response Area */}
                <div className="flex-grow flex flex-col">
                    <textarea
                        ref={textareaRef}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full flex-grow bg-black/80 border border-amber-500/30 rounded-sm p-4 text-white font-mono text-sm focus:border-amber-500 outline-none resize-none transition-all min-h-[200px]"
                    />
                    
                    {/* Word count & controls */}
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-[10px] text-gray-600 font-mono">
                            {getWordCount(response)} words
                        </span>
                        <button 
                            onClick={handlePromptComplete}
                            disabled={!response.trim()}
                            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-black font-orbitron text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isLastPrompt ? 'COMPLETE' : 'NEXT'}
                        </button>
                    </div>
                </div>
            </div>
        </TerminalShell>
    );
};

const BreathHoldTest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [seconds, setSeconds] = useState(0);
    const [phase, setPhase] = useState<'idle' | 'holding' | 'confirmation'>('idle');
    const startRef = useRef<number>(0);
    const frameRef = useRef<number>(0);
    const update = useCallback(() => { const now = performance.now(); setSeconds((now - startRef.current) / 1000); frameRef.current = requestAnimationFrame(update); }, []);
    const startHolding = (e: any) => { e.preventDefault(); if (phase === 'confirmation') return; setPhase('holding'); startRef.current = performance.now(); frameRef.current = requestAnimationFrame(update); };
    const stopHolding = () => { if (phase !== 'holding') return; setPhase('confirmation'); cancelAnimationFrame(frameRef.current); };
    const handleConfirm = () => onComplete({ 'vitality-breath-hold': { timeSeconds: seconds } });
    const handleRetry = () => { setSeconds(0); setPhase('idle'); };
    return (
        <TerminalShell title="Vitality Gate // Apnea">
            <div className="text-center space-y-8 flex flex-col items-center justify-center flex-grow py-6">
                <Wind className={`w-16 h-16 transition-all duration-500 ${phase === 'holding' ? 'text-cyan-400 scale-125' : 'text-gray-700'}`} />
                <div className="text-6xl font-mono font-bold text-white tracking-tighter tabular-nums">{seconds.toFixed(2)}s</div>
                <div className="w-full max-w-xs space-y-4 flex-shrink-0">
                    {phase === 'idle' && <button onMouseDown={startHolding} onTouchStart={startHolding} className="w-full py-8 bg-cyan-600 text-black font-black font-orbitron tracking-[0.3em] rounded-sm transition-all select-none">HOLD TO START</button>}
                    {phase === 'holding' && <button onMouseUp={stopHolding} onTouchEnd={stopHolding} className="w-full py-8 bg-red-600 text-white font-black font-orbitron tracking-[0.3em] rounded-sm transition-all select-none scale-95">RELEASE TO END</button>}
                    {phase === 'confirmation' && <div className="flex gap-4"><button onClick={handleRetry} className="flex-1 py-4 bg-gray-800 text-white font-orbitron tracking-widest rounded">RETRY</button><button onClick={handleConfirm} className="flex-1 py-4 bg-purple-600 text-white font-orbitron tracking-widest rounded">CONFIRM</button></div>}
                </div>
            </div>
        </TerminalShell>
    );
};

const AdaptiveKnowledgeTest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    const [difficulty, setDifficulty] = useState(50);
    const [round, setRound] = useState(1);
    const [history, setHistory] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState<KnowledgeQuestionV2 | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [phase, setPhase] = useState<'briefing' | 'active' | 'feedback'>('briefing');
    const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const TOTAL_ROUNDS = 10;

    const fetchNext = (currDiff: number, currHist: any[]) => {
        setLoading(true);
        const usedQuestions = currHist.map(h => h.q);
        
        // FIXED: Actually randomize difficulty search to prevent same questions
        const targetDifficulty = currDiff + (Math.random() * 20 - 10); // Add randomness ±10%
        
        // Try multiple times to get a different question
        let q = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            const attemptDiff = Math.max(10, Math.min(90, targetDifficulty + (Math.random() * 30 - 15)));
            q = getAdaptiveQuestionV2(attemptDiff, usedQuestions);
            if (q && !usedQuestions.includes(q.questionText)) {
                break;
            }
        }
        
        if (q) {
            setCurrentQ(q);
            setCorrectAnswer(q.acceptedAnswers[0]);
        } else {
            // Fallback question
            setCurrentQ({
                questionText: "What is the capital of France?",
                acceptedAnswers: ["Paris"],
                domain: "Geography",
                difficulty: 85
            });
            setCorrectAnswer("Paris");
        }
        setLoading(false);
        setUserAnswer('');
        
        // Focus input after a short delay
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleStart = () => { 
        setPhase('active'); 
        fetchNext(difficulty, history); 
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userAnswer.trim() || !currentQ || phase === 'feedback') return;
        
        const isCorrect = checkAnswer(userAnswer, currentQ.acceptedAnswers);
        setLastCorrect(isCorrect);
        setPhase('feedback');
        
        const newHistory = [...history, { 
            q: currentQ.questionText, 
            a: userAnswer, 
            correctAnswer: currentQ.acceptedAnswers[0],
            correct: isCorrect, 
            diff: difficulty 
        }];
        setHistory(newHistory);
        
        // Adaptive difficulty adjustment
        // Start with bigger steps, get smaller as we narrow in
        const step = Math.max(5, 35 / (round + 0.5));
        const nextDiff = isCorrect 
            ? Math.max(5, difficulty - step)  // Correct = DECREASE % = harder next
            : Math.min(95, difficulty + step); // Wrong = INCREASE % = easier next
        
        setTimeout(() => {
            if (round >= TOTAL_ROUNDS) {
                // Final score: difficulty represents percentile of population answering correctly
                // User settles at difficulty=50 means 50% of people answer correctly = score 50
                // User settles at difficulty=80 means 80% of people answer correctly = easier = score 20
                // User settles at difficulty=20 means 20% of people answer correctly = harder = score 80
                const finalScore = 100 - difficulty; // Invert: lower difficulty = harder = higher score
                onComplete({ adaptiveKnowledgeScore: finalScore, history: newHistory, finalDifficulty: difficulty });
            } else {
                setDifficulty(nextDiff);
                setRound(r => r + 1);
                setPhase('active');
                fetchNext(nextDiff, newHistory);
            }
        }, 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && phase === 'active') {
            handleSubmit();
        }
    };

    const getDifficultyLabel = (diff: number) => {
        if (diff >= 85) return { label: 'VERY EASY', color: 'text-green-400', desc: 'Almost everyone knows this' };
        if (diff >= 70) return { label: 'EASY', color: 'text-green-300', desc: 'Most people know this' };
        if (diff >= 50) return { label: 'MEDIUM', color: 'text-yellow-400', desc: 'Average knowledge' };
        if (diff >= 30) return { label: 'HARD', color: 'text-orange-400', desc: 'Above average knowledge needed' };
        if (diff >= 15) return { label: 'VERY HARD', color: 'text-red-400', desc: 'Expert knowledge needed' };
        return { label: 'EXTREME', color: 'text-red-500', desc: 'Specialist knowledge' };
    };

    if (phase === 'briefing') return (
        <TerminalShell title="Knowledge Matrix // Briefing">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-12 space-y-8">
                <Book className="w-20 h-20 text-purple-500 animate-pulse" />
                <div className="space-y-4">
                    <h2 className="text-2xl font-black font-orbitron text-white uppercase tracking-[0.2em]">ADAPTIVE KNOWLEDGE TEST</h2>
                    <div className="bg-gray-900/40 p-6 border border-gray-800 rounded-sm max-w-sm text-left">
                        <p className="text-gray-400 font-mono text-[10px] leading-relaxed uppercase">
                            <span className="text-cyan-400 font-bold">Protocol:</span> {TOTAL_ROUNDS} questions across multiple domains. Answer as accurately as you can.
                        </p>
                        <p className="text-gray-500 font-mono text-[10px] leading-relaxed mt-4 italic">
                            "Your comprehensive knowledge profile will be analyzed in your final dossier."
                        </p>
                    </div>
                </div>
                <button onClick={handleStart} className="btn-primary w-full max-w-xs font-orbitron tracking-[0.3em] py-5 uppercase text-sm">BEGIN TEST</button>
            </div>
        </TerminalShell>
    );

    if (loading || !currentQ) return <TerminalShell title="Knowledge Matrix // Loading"><Loader text="PREPARING QUESTION..." /></TerminalShell>;

    const diffInfo = getDifficultyLabel(currentQ.difficulty);

    return (
        <TerminalShell title={`Knowledge Matrix // Question ${round}/${TOTAL_ROUNDS}`}>
            <div className="flex flex-col h-full justify-center">
                {/* Question */}
                <div className="relative mb-8">
                    <p className="text-xl text-white font-serif italic leading-relaxed px-2 text-center">"{currentQ.questionText}"</p>
                </div>

                {/* Answer input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={phase === 'feedback'}
                            placeholder="Type your answer..."
                            className={`w-full bg-gray-900/80 border p-4 text-lg font-mono text-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                'border-gray-700 text-white hover:border-purple-500'
                            }`}
                            autoComplete="off"
                            autoCapitalize="off"
                        />
                    </div>
                    
                    {phase === 'active' && (
                        <button 
                            type="submit"
                            disabled={!userAnswer.trim()}
                            className="w-full btn-primary font-orbitron tracking-[0.2em] py-4 uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    )}
                </form>
            </div>
        </TerminalShell>
    );
};

// ============================================
// 3-PART MINI-MODULE: STRATEGY ASSESSMENT
// Part 1: Warm-Up (River Crossing)
// Part 2: Core (Chess Tactics)
// Part 3: Closer (Resource/Decision Scenario)
// ============================================

const StrategyAssessment3Part: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    // ========== PART 1: LOGIC PUZZLE (QUICK WARM-UP) ==========
    const quickLogicPuzzle = {
        title: "LOGIC PUZZLE",
        prompt: "Three guards stand before three doors. One leads to exit, two lead to traps. Guard A always lies, Guard B always tells truth, Guard C does both randomly. You can ask ONE question to ONE guard. What do you ask to guarantee exit?",
        hint: "Ask about what ANOTHER guard would say.",
        answer: "Ask any guard: 'If I asked the truth-teller which door is safe, what would they say?' Then pick the OPPOSITE door.",
        maxScore: 25,
        scoringGuide: {
            optimal: { range: [20, 25], desc: "Correct logic (opposite/strategy)" },
            partial: { range: [10, 19], desc: "Right thinking, incomplete logic" },
            wrong: { range: [0, 9], desc: "Wrong/no clear strategy" }
        }
    };

    // ========== PART 2: QUICK CHESS PUZZLE (SINGLE PUZZLE) ==========
    const chessPuzzles = [
        {
            id: 1,
            title: "FORCED WIN",
            description: "White to move. Deliver checkmate or win material in 2 moves.",
            hint: "Look for a forcing check that limits Black's options.",
            bestMove: "Qh7",
            explanation: "Queen check forces the king to move, leading to decisive advantage or mate.",
            strategicConcept: "Forcing moves (checks, captures, threats) are the foundation of tactical play."
        }
    ];

    // ========== PART 3: RESOURCE PRIORITIZATION (CLOSER) ==========
    const resourceScenario = {
        title: "PROJECT PRIORITIZATION",
        prompt: "In a project with limited time/budget/team, prioritize these 4 tasks and justify with risk awareness:",
        tasks: [
            { id: "A", name: "Fix critical bug", desc: "Blocks 50% of users" },
            { id: "B", name: "Add new feature", desc: "Revenue potential +20%" },
            { id: "C", name: "Market research", desc: "Validates product-market fit" },
            { id: "D", name: "Competitor analysis", desc: "Informs strategy" }
        ],
        maxScore: 20,
        scoringGuide: "Logical prioritization (critical bug first) + trade-off awareness + backup plan depth"
    };

    // ========== STATE MANAGEMENT ==========
    const [phase, setPhase] = useState<'intro' | 'part1_input' | 'part1_feedback' | 'part2_briefing' | 'part2_puzzle' | 'part2_reflection' | 'part3_input' | 'part3_feedback' | 'complete'>('intro');
    
    // Part 1 state
    const [riverInput, setRiverInput] = useState('');
    const [riverFeedback, setRiverFeedback] = useState<{ score: number; level: string; message: string } | null>(null);
    const [riverScore, setRiverScore] = useState(0);
    
    // Part 2 state
    const [chessPuzzleIndex, setChessPuzzleIndex] = useState(0);
    const [chessMove, setChessMove] = useState('');
    const [chessFeedback, setChessFeedback] = useState<string | null>(null);
    const [chessIsCorrect, setChessIsCorrect] = useState<boolean | null>(null);
    const [chessScore, setChessScore] = useState(0);
    const [chessShowReflection, setChessShowReflection] = useState(false);
    const [chessReflection, setChessReflection] = useState('');
    const [chessHistory, setChessHistory] = useState<any[]>([]);
    
    // Part 3 state
    const [resourceRanking, setResourceRanking] = useState<string[]>([]);
    const [resourceJustification, setResourceJustification] = useState('');
    const [resourceContingency, setResourceContingency] = useState('');
    const [resourceScore, setResourceScore] = useState(0);
    const [resourceFeedback, setResourceFeedback] = useState<string | null>(null);

    const currentChessPuzzle = chessPuzzles[chessPuzzleIndex];
    const chessProgress = ((chessPuzzleIndex + 1) / chessPuzzles.length) * 100;

    // ========== PART 1: LOGIC PUZZLE VALIDATION ==========
    const validateLogicPuzzle = () => {
        const input = riverInput.toLowerCase();
        
        let score = 0;
        let level = '';
        let message = '';
        
        // Quick validation: look for key concepts
        const hasOpposite = input.includes('opposite') || input.includes('other') || input.includes('opposite door');
        const hasStrategy = input.includes('ask') || input.includes('truth') || input.includes('strategy');
        const hasLogic = input.length >= 30;
        
        if (!hasLogic) {
            score = 5;
            level = 'INCOMPLETE';
            message = '✗ Response too brief. Think: how do you use logic to guarantee safety?';
        } else if (hasOpposite && hasStrategy) {
            score = 24;
            level = 'OPTIMAL';
            message = '✓ Excellent! You found the logic trick: ask any guard about the opposite answer. Strategic thinking at work!';
        } else if (hasStrategy && hasLogic) {
            score = 16;
            level = 'GOOD';
            message = '✓ Good strategy! You got the right idea about using logic. The key: ask about the opposite door.';
        } else if (hasLogic) {
            score = 10;
            level = 'PARTIAL';
            message = '✓ Partial success. You showed logical thinking, but the optimal strategy is to ask about the opposite door/guard.';
        } else {
            score = 5;
            level = 'STUCK';
            message = '✗ No clear strategy. Key insight: Ask any guard "What would the truth-teller say?" Then pick OPPOSITE.';
        }
        
        setRiverScore(score);
        setRiverFeedback({ score, level, message });
        setPhase('part1_feedback');
    };

    const continueToPart2 = () => {
        setPhase('part2_briefing');
    };

    // ========== PART 2: CHESS VALIDATION ==========
    const validateChessMove = () => {
        const moveRegex = /^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[QRBN])?(\+|#)?$/i;
        const userMoveClean = chessMove.trim().toUpperCase();
        
        const isValidNotation = moveRegex.test(userMoveClean) || userMoveClean === 'O-O' || userMoveClean === 'O-O-O';
        
        if (!isValidNotation) {
            setChessIsCorrect(false);
            setChessFeedback(`✗ Invalid notation. Use algebraic (e.g., Nxe5, e4, O-O). The best move is ${currentChessPuzzle.bestMove}.`);
            setChessShowReflection(true);
            return;
        }
        
        const correctAnswer = userMoveClean === currentChessPuzzle.bestMove.toUpperCase() ||
            userMoveClean.replace(/x/i, 'X') === currentChessPuzzle.bestMove.toUpperCase().replace(/x/i, 'X');
        
        setChessIsCorrect(correctAnswer);
        if (correctAnswer) {
            const pointsPerPuzzle = 25;
            setChessScore(prev => prev + pointsPerPuzzle);
            setChessFeedback(`✓ Correct! ${currentChessPuzzle.explanation}`);
        } else {
            setChessFeedback(`✗ Not quite. The best move is ${currentChessPuzzle.bestMove}. ${currentChessPuzzle.explanation}`);
        }
        setChessShowReflection(true);
    };

    const handleChessReflectionSubmit = () => {
        const newHistory = [...chessHistory, {
            puzzleId: currentChessPuzzle.id,
            title: currentChessPuzzle.title,
            userMove: chessMove,
            correct: chessIsCorrect,
            reflection: chessReflection.trim(),
            concept: currentChessPuzzle.strategicConcept
        }];
        setChessHistory(newHistory);

        if (chessPuzzleIndex >= chessPuzzles.length - 1) {
            // Move to Part 3
            setPhase('part3_input');
        } else {
            setChessPuzzleIndex(prev => prev + 1);
            setChessMove('');
            setChessFeedback(null);
            setChessIsCorrect(null);
            setChessReflection('');
            setChessShowReflection(false);
            setPhase('part2_puzzle');
        }
    };

    // ========== PART 3: RESOURCE PRIORITIZATION VALIDATION ==========
    const validateResourcePrioritization = () => {
        if (resourceRanking.length !== 4) {
            setResourceFeedback('✗ Please rank all 4 items.');
            return;
        }
        if (!resourceJustification.trim() || resourceJustification.trim().length < 30) {
            setResourceFeedback('✗ Please provide a justification (min 30 characters).');
            return;
        }
        if (!resourceContingency.trim() || resourceContingency.trim().length < 20) {
            setResourceFeedback('✗ Please describe a contingency plan.');
            return;
        }

        // Score: A (Critical bug) should be first, then logic
        let score = 0;
        const isAFirst = resourceRanking[0] === 'A';
        const hasRiskAwareness = resourceJustification.toLowerCase().includes('risk') ||
            resourceJustification.toLowerCase().includes('impact') ||
            resourceJustification.toLowerCase().includes('critical');
        const hasBackupLogic = resourceContingency.toLowerCase().includes('if') ||
            resourceContingency.toLowerCase().includes('then') ||
            resourceContingency.toLowerCase().includes('fail');

        if (isAFirst && hasRiskAwareness && hasBackupLogic) {
            score = 20;
            setResourceFeedback('✓ Excellent strategic thinking! You prioritized impact (critical bug), showed trade-off awareness, and articulated contingencies.');
        } else if (isAFirst && hasRiskAwareness) {
            score = 15;
            setResourceFeedback('✓ Good logic. You prioritized correctly and identified risks, but contingency could be deeper.');
        } else if (isAFirst) {
            score = 10;
            setResourceFeedback('✓ Correct priority, but justification lacks risk framing. Next time, explain *why* this order mitigates threats.');
        } else {
            score = 5;
            setResourceFeedback('✗ Reconsider: critical bugs block users. That usually comes first. Strategic foresight means addressing threats before opportunities.');
        }

        setResourceScore(score);
        setPhase('part3_feedback');
    };

    const completeAssessment = () => {
        // Calculate final scores and averages
        const totalScore = riverScore + chessScore + resourceScore;
        const averageStrategyScore = Math.round(totalScore / 3);
        
        // Map to substat ranges
        const strategySubstat = Math.min(95, Math.round((riverScore + chessScore) / 2));
        const reasonSubstat = Math.min(95, Math.round((chessScore + resourceScore) / 1.5));
        const perceptionSubstat = Math.min(95, chessScore * 2.5);
        const convictionSubstat = Math.min(95, Math.round((resourceScore + riverScore) / 1.5));
        const resilienceSubstat = Math.min(95, 50 + (riverScore + resourceScore));

        onComplete({
            strategyScore: averageStrategyScore,
            totalScore,
            partScores: {
                warmup: riverScore,
                core: chessScore,
                closer: resourceScore
            },
            substatContributions: {
                Strategy: strategySubstat,
                Reason: reasonSubstat,
                Perception: perceptionSubstat,
                Conviction: convictionSubstat,
                Resilience: resilienceSubstat
            },
            chessHistory,
            riverSolution: riverInput,
            resourceRanking,
            resourceJustification,
            resourceContingency
        });
    };

    // ========== PART 1: WARM-UP (RIVER CROSSING) ==========
    if (phase === 'intro') return (
        <TerminalShell title="Strategic Engine // 3-Part Calibration" accentClass="border-cyan-900/50">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-12 space-y-8">
                <div className="text-5xl">🧭</div>
                <h2 className="text-2xl font-black font-orbitron text-cyan-400 uppercase tracking-[0.2em]">STRATEGY MATRIX QUICK</h2>
                <div className="bg-gray-900/40 p-6 border border-cyan-900/30 rounded-sm max-w-2xl text-left space-y-4">
                    <p className="text-gray-300 text-sm"><span className="text-cyan-400 font-bold">Protocol:</span> Quick 3-part assessment of strategic thinking (10 min max).</p>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                        <div className="bg-cyan-900/20 p-3 border border-cyan-700/30 rounded">
                            <span className="text-cyan-400 font-bold">Part 1</span><br/>Logic<br/>(2–3 min)
                        </div>
                        <div className="bg-cyan-900/20 p-3 border border-cyan-700/30 rounded">
                            <span className="text-cyan-400 font-bold">Part 2</span><br/>Chess<br/>(3–4 min)
                        </div>
                        <div className="bg-cyan-900/20 p-3 border border-cyan-700/30 rounded">
                            <span className="text-cyan-400 font-bold">Part 3</span><br/>Decision<br/>(2–3 min)
                        </div>
                    </div>
                </div>
                <button onClick={() => setPhase('part1_input')} className="btn-primary w-full max-w-xs font-orbitron tracking-[0.3em] py-5 uppercase text-sm bg-cyan-600 hover:bg-cyan-500">BEGIN ASSESSMENT</button>
            </div>
        </TerminalShell>
    );

    if (phase === 'part1_input') return (
        <TerminalShell title="Strategic Engine // Part 1: Logic Puzzle" accentClass="border-yellow-900/50">
            <div className="flex flex-col h-full gap-4">
                <div className="w-full bg-gray-900 h-1 rounded-full"><div className="bg-yellow-500 h-full w-[33%] rounded-full transition-all" /></div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-4">
                    <h3 className="text-yellow-400 font-orbitron uppercase tracking-widest text-sm font-bold mb-2">🧩 {quickLogicPuzzle.title}</h3>
                    <p className="text-gray-400 text-xs italic">Tests strategic thinking & logic (quick mental puzzle).</p>
                </div>
                <div className="bg-black border border-gray-700 p-4 rounded-sm flex-grow flex flex-col">
                    <p className="text-gray-300 text-sm mb-4 font-mono">{quickLogicPuzzle.prompt}</p>
                    <p className="text-gray-600 text-xs italic mb-4">💡 {quickLogicPuzzle.hint}</p>
                    <textarea
                        value={riverInput}
                        onChange={(e) => setRiverInput(e.target.value)}
                        placeholder="Describe your step-by-step solution..."
                        className="w-full bg-black border border-gray-700 rounded-sm p-3 text-white font-mono text-xs flex-grow mb-4 focus:border-yellow-500 outline-none resize-none"
                    />
                    <button onClick={validateLogicPuzzle} disabled={riverInput.trim().length < 30} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-orbitron py-3 tracking-widest uppercase text-xs transition-all disabled:opacity-30">SUBMIT ANSWER</button>
                </div>
            </div>
        </TerminalShell>
    );

    if (phase === 'part1_feedback' && riverFeedback) return (
        <TerminalShell title="Strategic Engine // Part 1 Results" accentClass="border-yellow-900/50">
            <div className="flex flex-col h-full gap-4">
                <div className="w-full bg-gray-900 h-1 rounded-full"><div className="bg-yellow-500 h-full w-[33%] rounded-full" /></div>
                <div className="space-y-3">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">{riverFeedback.score}/30</div>
                        <div className="text-xs text-yellow-600 font-orbitron tracking-widest uppercase">{riverFeedback.level}</div>
                    </div>
                    <div className={`p-4 rounded-sm text-sm border ${riverFeedback.score >= 25 ? 'bg-green-900/30 border-green-600 text-green-300' : riverFeedback.score >= 15 ? 'bg-blue-900/30 border-blue-600 text-blue-300' : 'bg-red-900/30 border-red-600 text-red-300'}`}>
                        {riverFeedback.message}
                    </div>
                    <div className="bg-gray-900/30 p-3 border border-gray-700 rounded-sm text-xs text-gray-400 font-mono">
                        <span className="text-gray-500 font-bold">Correct Answer:</span><br/>{quickLogicPuzzle.answer}
                    </div>
                </div>
                <button onClick={continueToPart2} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron py-3 tracking-widest uppercase text-xs mt-auto">PROCEED TO PART 2</button>
            </div>
        </TerminalShell>
    );

    if (phase === 'part2_briefing') return (
        <TerminalShell title="Strategic Engine // Part 2: Chess Tactic" accentClass="border-green-900/50">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-12 space-y-8">
                <div className="text-5xl">♔</div>
                <h2 className="text-xl font-black font-orbitron text-green-400 uppercase tracking-[0.2em]">CHESS TACTIC</h2>
                <div className="w-full bg-gray-900 h-1 rounded-full"><div className="bg-green-500 h-full w-[67%] rounded-full" /></div>
                <div className="bg-gray-900/40 p-6 border border-green-900/30 rounded-sm max-w-2xl text-left space-y-4">
                    <p className="text-gray-300 text-sm"><span className="text-green-400 font-bold">Protocol:</span> One key tactical puzzle testing calculation and candidate moves.</p>
                    <p className="text-gray-400 text-xs italic">Identify the best move for White. Then briefly explain the strategic principle.</p>
                </div>
                <button onClick={() => setPhase('part2_puzzle')} className="btn-primary w-full max-w-xs font-orbitron tracking-[0.3em] py-5 uppercase text-sm bg-green-600 hover:bg-green-500">BEGIN PUZZLE</button>
            </div>
        </TerminalShell>
    );

    if (phase === 'part2_puzzle') return (
        <TerminalShell title={`Strategic Engine // Puzzle ${chessPuzzleIndex + 1}/${chessPuzzles.length}`} accentClass="border-green-900/50">
            <div className="flex flex-col h-full gap-4">
                <div className="w-full bg-gray-900 h-1 rounded-full"><div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${chessProgress}%` }} /></div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4">
                    <h3 className="text-green-400 font-orbitron uppercase tracking-widest text-sm font-bold mb-2">{currentChessPuzzle.title}</h3>
                    <p className="text-gray-400 text-xs italic">{currentChessPuzzle.description}</p>
                </div>
                <div className="bg-black border border-gray-700 p-4 rounded-sm">
                    <div className="text-center space-y-2">
                        <div className="text-gray-400 text-sm font-mono">{currentChessPuzzle.hint}</div>
                        <div className="text-gray-600 text-xs italic">Strategic Concept: {currentChessPuzzle.strategicConcept}</div>
                    </div>
                </div>
                {!chessShowReflection ? (
                    <div className="space-y-3">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest font-bold">Your best move:</label>
                        <div className="flex gap-2">
                            <input type="text" value={chessMove} onChange={(e) => setChessMove(e.target.value)} placeholder="e.g., Nxe5, Qh7" className="flex-grow bg-black border border-gray-700 rounded-sm p-3 text-white font-mono focus:border-green-500 outline-none" onKeyDown={(e) => e.key === 'Enter' && validateChessMove()} />
                            <button onClick={validateChessMove} disabled={!chessMove.trim()} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-orbitron text-xs uppercase tracking-widest transition-all disabled:opacity-30">SUBMIT</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 flex-grow flex flex-col">
                        <div className={`p-3 rounded-sm text-sm ${chessIsCorrect ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>{chessFeedback}</div>
                        <div className="space-y-2 flex-grow flex flex-col">
                            <label className="block text-xs text-gray-500 uppercase tracking-widest font-bold">Reflect on this puzzle:</label>
                            <textarea value={chessReflection} onChange={(e) => setChessReflection(e.target.value)} placeholder="What principle does this move show? Where would you use it?" className="w-full bg-black border border-gray-700 rounded-sm p-3 text-white font-mono text-xs resize-none flex-grow focus:border-green-500 outline-none" />
                        </div>
                        <button onClick={handleChessReflectionSubmit} className="w-full bg-green-600 hover:bg-green-500 text-black font-orbitron py-3 tracking-widest uppercase text-xs">{chessPuzzleIndex === chessPuzzles.length - 1 ? 'NEXT TO PART 3' : 'NEXT PUZZLE'}</button>
                    </div>
                )}
            </div>
        </TerminalShell>
    );

    if (phase === 'part3_input') return (
        <TerminalShell title="Strategic Engine // Part 3: Decision Scenario" accentClass="border-purple-900/50">
            <div className="flex flex-col h-full gap-4">
                <div className="w-full bg-gray-900 h-1 rounded-full"><div className="bg-purple-500 h-full w-[100%] rounded-full" /></div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-sm p-4">
                    <h3 className="text-purple-400 font-orbitron uppercase tracking-widest text-sm font-bold mb-2">📊 {resourceScenario.title}</h3>
                    <p className="text-gray-400 text-xs italic">Test resource prioritization under constraints.</p>
                </div>
                <div className="bg-black border border-gray-700 p-4 rounded-sm flex-grow overflow-y-auto space-y-4">
                    <p className="text-gray-300 text-sm font-mono">{resourceScenario.prompt}</p>
                    <div className="grid grid-cols-1 gap-3">
                        {resourceScenario.tasks.map(task => (
                            <div key={task.id} className="bg-gray-900 border border-gray-700 p-3 rounded-sm">
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                    <input type="radio" name="ranking" value={task.id} checked={resourceRanking[0] === task.id} readOnly className="w-4 h-4" />
                                    <span>[{task.id}]</span> {task.name}
                                </div>
                                <div className="text-xs text-gray-500 ml-6">{task.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs text-purple-400 font-bold">Rank by priority (drag or list: A, B, C, D):</label>
                        <input type="text" value={resourceRanking.join(', ')} onChange={(e) => setResourceRanking(e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(s => ['A', 'B', 'C', 'D'].includes(s)))} placeholder="e.g., A, C, B, D" className="w-full bg-black border border-gray-700 rounded-sm p-2 text-white font-mono text-xs focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs text-purple-400 font-bold">Justify your ranking (why this order?):</label>
                        <textarea value={resourceJustification} onChange={(e) => setResourceJustification(e.target.value)} placeholder="Explain trade-offs and risk impact..." className="w-full bg-black border border-gray-700 rounded-sm p-2 text-white font-mono text-xs resize-none h-12 focus:border-purple-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs text-purple-400 font-bold">Contingency plan (if top priority fails, what's Plan B?):</label>
                        <textarea value={resourceContingency} onChange={(e) => setResourceContingency(e.target.value)} placeholder="If [priority] fails, then I would..." className="w-full bg-black border border-gray-700 rounded-sm p-2 text-white font-mono text-xs resize-none h-12 focus:border-purple-500 outline-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    {resourceFeedback && <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-600/30">{resourceFeedback}</div>}
                    <button onClick={validateResourcePrioritization} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-orbitron py-3 tracking-widest uppercase text-xs">SUBMIT RANKING</button>
                </div>
            </div>
        </TerminalShell>
    );

    if (phase === 'part3_feedback') return (
        <TerminalShell title="Strategic Engine // Part 3 Results" accentClass="border-purple-900/50">
            <div className="flex flex-col h-full gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">{resourceScore}/20</div>
                    <div className="text-xs text-purple-600 font-orbitron tracking-widest uppercase">Decision Quality</div>
                </div>
                <div className={`p-4 rounded-sm text-sm border ${resourceScore >= 15 ? 'bg-green-900/30 border-green-600 text-green-300' : resourceScore >= 10 ? 'bg-blue-900/30 border-blue-600 text-blue-300' : 'bg-red-900/30 border-red-600 text-red-300'}`}>{resourceFeedback}</div>
                <button onClick={() => { setPhase('complete'); setTimeout(() => completeAssessment(), 1500); }} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron py-3 tracking-widest uppercase text-xs mt-auto">FINALIZE ASSESSMENT</button>
            </div>
        </TerminalShell>
    );

    if (phase === 'complete') return (
        <TerminalShell title="Strategic Engine // Assessment Complete" accentClass="border-cyan-900/50">
            <div className="flex flex-col items-center justify-center flex-grow py-12 space-y-4">
                <Check className="w-16 h-16 text-cyan-500" />
                <h2 className="text-xl font-black font-orbitron text-cyan-400 uppercase tracking-widest">STRATEGY MATRIX COMPLETE</h2>
                <p className="text-gray-500 font-mono text-xs">Processing 3-part assessment results...</p>
            </div>
        </TerminalShell>
    );

    return null;
};

const SimonSaysTest: React.FC<{ onComplete: (result: any) => void }> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'idle' | 'playing' | 'showing' | 'gameover'>('idle');
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [level, setLevel] = useState(1);
    const [canClick, setCanClick] = useState(false);
    const sequenceRef = useRef<number[]>([]);
    const userSeqRef = useRef<number[]>([]);

    const playSequence = useCallback(async (seq: number[]) => {
        setPhase('showing');
        setCanClick(false);
        await new Promise(resolve => setTimeout(resolve, 500));

        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    setActiveButton(seq[i]);
                    setTimeout(() => {
                        setActiveButton(null);
                        resolve(null);
                    }, 400);
                }, 600);
            });
        }

        setPhase('playing');
        setCanClick(true);
        userSeqRef.current = [];
        setUserSequence([]);
    }, []);

    const startLevel = useCallback((currentSeq: number[]) => {
        const nextButton = Math.floor(Math.random() * 16);
        const newSeq = [...currentSeq, nextButton];
        sequenceRef.current = newSeq;
        setSequence(newSeq);
        playSequence(newSeq);
    }, [playSequence]);

    const handleButtonClick = useCallback((index: number) => {
        if (!canClick || phase !== 'playing') return;

        setCanClick(false);
        setActiveButton(index);
        setTimeout(() => setActiveButton(null), 200);

        const newUserSeq = [...userSeqRef.current, index];
        userSeqRef.current = newUserSeq;
        setUserSequence(newUserSeq);

        // Check if user clicked the wrong button
        if (index !== sequenceRef.current[newUserSeq.length - 1]) {
            setPhase('gameover');
            return;
        }

        // Check if user completed the sequence
        if (newUserSeq.length === sequenceRef.current.length) {
            setLevel(l => l + 1);
            setTimeout(() => {
                startLevel(sequenceRef.current);
            }, 1000);
        } else {
            setCanClick(true);
        }
    }, [canClick, phase, startLevel]);

    const handleStart = () => {
        setLevel(1);
        sequenceRef.current = [];
        userSeqRef.current = [];
        setSequence([]);
        setUserSequence([]);
        startLevel([]);
    };

    const handleFinish = () => {
        // Calculate additional metrics beyond max level
        const totalButtons = sequenceRef.current.length;
        const errorPoint = userSeqRef.current.length; // How far user got before error
        const progressPercentage = (errorPoint / Math.max(totalButtons, 1)) * 100;
        const MIN_LEVELS = 5; // Minimum engagement threshold
        const incompleteFlag = level < MIN_LEVELS;
        
        // Map to substats:
        // - Adaptability: Based on how many sequences completed (learning curve)
        // - Resilience: Based on progress despite failures
        // - Focus: Based on sequence length (longer = better focus)
        // - Perception: Based on pattern recognition (level)
        const adaptabilityScore = Math.min(95, (level / 25) * 100);
        const resilienceScore = Math.min(95, 40 + progressPercentage * 0.5);
        const focusScore = Math.min(95, 30 + (level / 25) * 60);
        const perceptionScore = Math.min(95, (level / 25) * 100);
        
        // Learning curve: check for consistent progression
        const learningRate = Math.min(100, (level / 10) * 100);
        
        onComplete({ 
            maxLevel: level,
            totalSequenceLength: totalButtons,
            errorPoint: errorPoint,
            progressPercentage: progressPercentage,
            incomplete: incompleteFlag, // Flag if quit before MIN_LEVELS
            learningRate,
            // Substat contributions for integration
            substatContributions: {
                Adaptability: adaptabilityScore,
                Resilience: resilienceScore,
                Focus: focusScore,
                Perception: perceptionScore
            }
        });
    };

    const buttonColors = [
        'bg-red-600', 'bg-red-700', 'bg-red-500', 'bg-red-800',
        'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-500', 'bg-yellow-800',
        'bg-blue-600', 'bg-blue-700', 'bg-blue-500', 'bg-blue-800',
        'bg-green-600', 'bg-green-700', 'bg-green-500', 'bg-green-800',
    ];

    return (
        <TerminalShell title="Cognitive Architecture // Adaptability Matrix">
            <div className="flex flex-col items-center justify-center flex-grow py-4 space-y-6">
                {phase === 'idle' && (
                    <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">Memorize and repeat the sequence of colors.</p>
                        <button 
                            onClick={handleStart} 
                            className="btn-primary w-full max-w-xs font-orbitron tracking-widest uppercase"
                        >
                            INITIALIZE
                        </button>
                    </div>
                )}
                
                {(phase === 'showing' || phase === 'playing' || phase === 'gameover') && (
                    <div className="w-full max-w-md space-y-4">
                        {/* Simon Says Grid */}
                        <div className="grid grid-cols-4 gap-2">
                            {buttonColors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleButtonClick(i)}
                                    disabled={!canClick || phase !== 'playing'}
                                    className={`w-full aspect-square rounded border-2 transition-all font-bold text-xs uppercase ${
                                        activeButton === i 
                                            ? `${color} border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]` 
                                            : `${color} opacity-60 border-gray-700 hover:opacity-80`
                                    } ${!canClick ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                            ))}
                        </div>

                        {/* Finish Button */}
                        {phase === 'gameover' && (
                            <div className="space-y-2">
                                {level < 5 && (
                                    <div className="bg-yellow-900/40 border border-yellow-700 p-3 rounded text-xs text-yellow-300 font-mono text-center">
                                        WARNING: Minimum 5 levels recommended. You reached {level}. Results will be flagged as incomplete.
                                    </div>
                                )}
                                <button 
                                    onClick={handleFinish}
                                    className="w-full btn-primary font-orbitron tracking-widest uppercase py-3"
                                >
                                    FINISH ({level < 5 ? 'INCOMPLETE' : 'COMPLETE'})
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </TerminalShell>
    );
};

// --- MAIN ONBOARDING PAGE ---
export const OnboardingPage: React.FC = () => {
    const { seedInitialState, gameState, startTour } = useGameState();
    const { addToast } = useToast();
    const [stepIndex, setStepIndex] = useState(0);
    const [allInputs, setAllInputs] = useState<Record<string, any>>({});
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [report, setReport] = useState<FullCalibrationReport | null>(null);
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);

    const handleStepComplete = async (data: any) => {
        const step = CALIBRATION_BENCHMARKS[stepIndex];
        const newInputs = { ...allInputs, [step.id]: data };
        setAllInputs(newInputs);
        if (stepIndex < CALIBRATION_BENCHMARKS.length - 1) setStepIndex(stepIndex + 1);
        else await finalizeOnboarding(newInputs);
    };

    const handleSkipStep = async () => {
        // Skip current step - move to next without saving current step's data
        setShowSkipConfirm(false);
        if (stepIndex < CALIBRATION_BENCHMARKS.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            // At last step - finalize with collected data
            await finalizeOnboarding(allInputs);
        }
    };

    const handleSkipOnboarding = async () => {
        // Complete skip - bypass all remaining steps and finalize with current collected data
        setShowSkipConfirm(false);
        setIsFinalizing(true);
        try {
            // Finalize with whatever data was collected so far
            await finalizeOnboarding(allInputs);
        } catch (error) {
            console.error('Skip onboarding error:', error);
            addToast("Skip failed. Continue onboarding.", "error");
            setIsFinalizing(false);
        }
    };

    const finalizeOnboarding = async (inputs: any) => {
        setIsFinalizing(true);
        try {
            const physical = inputs['physical-performance'] || {};
            const breath = inputs['breath-hold-test']?.['vitality-breath-hold'] || {};
            const knowledge = inputs['adaptive-knowledge-test'] || {};
            const equilibrium = inputs['ai-adaptive-reasoning'] || {};
            const simonSays = inputs['simon-says-test'] || {};
            const psycheSocial = inputs['psyche-social-questionnaire'] || {};
            const vitality = inputs['vitality-questionnaire'] || {};
            const fittsLaw = inputs['fitts-law-test'] || {};
            const stroop = inputs['resilience-stroop'] || {};
            const dilemmas = inputs['dilemma-screening'] || {};
            const strategy = inputs['high-stakes-war-room'] || {};

            // Extract questionnaire responses for Spirit and Psyche substats
            const faithPercentile = parseInt(psycheSocial.religiosity) || 50;
            const charismaPercentile = parseInt(psycheSocial.socialConfidence) || 50;
            const composurePercentile = parseInt(psycheSocial.conflictResolution) || 50;
            const stressLevelValue = parseInt(vitality.stressLevels) || 50;
            // Tranquility is inverse of stress (high stress = low tranquility)
            const tranquilityPercentile = Math.max(1, Math.min(100, 100 - stressLevelValue));

            // Evaluate creativity using the finalized 5-prompt system
            let creativityPercentile = 50; // Default fallback
            let creativitySubstats: any = null;
            const creativityData = inputs['creative-protocol-test'];
            if (creativityData) {
                try {
                    const creativityScores = await evaluateCreativityAnswers(creativityData);
                    // Calculate average percentile across all 5 substats
                    const substats = ['Imagination', 'Innovation', 'Style', 'Vision', 'Expression'];
                    const percentiles = substats.map((s: string) => creativityScores[s]?.percentile || 50);
                    creativityPercentile = Math.round(percentiles.reduce((a: number, b: number) => a + b, 0) / percentiles.length);
                    creativitySubstats = creativityScores;
                } catch (e) {
                    console.error('Creativity evaluation error:', e);
                    creativityPercentile = 50;
                }
            }

            // Use comprehensive substat calculator that maps all tests to substats
            const substatsPercentiles = calculateSubstatsFromAllTests(inputs);
            
            // Update creativity substats if available from AI evaluation
            if (creativityData && creativitySubstats) {
                substatsPercentiles[SubStatName.Imagination] = creativitySubstats['Imagination']?.percentile || 50;
                substatsPercentiles[SubStatName.Innovation] = creativitySubstats['Innovation']?.percentile || 50;
                substatsPercentiles[SubStatName.Style] = creativitySubstats['Style']?.percentile || 50;
                substatsPercentiles[SubStatName.Vision] = creativitySubstats['Vision']?.percentile || 50;
                substatsPercentiles[SubStatName.Expression] = creativitySubstats['Expression']?.percentile || 50;
            }

            // interpolate is already imported at the top

            // Convert all substats to values and build stats array
            const stats: Stat[] = INITIAL_STATS.map(s => {
                const statName = s.name as StatName;
                const substatNames = STAT_SUBSTAT_MAP[statName];
                
                // Convert each substat percentile to value
                const subStats = substatNames.map(ssName => {
                    const percentile = substatsPercentiles[ssName] || 50;
                    const value = convertPercentileToSubstatValue(percentile);
                    return {
                        name: ssName,
                        value: Math.round(value),
                        rank: mapScoreToRank(percentile),
                        lastIncreased: new Date().toISOString()
                    };
                });
                
                // Main stat value = average of its 5 substats
                const totalValue = subStats.reduce((sum, ss) => sum + ss.value, 0);
                const avgPercentile = (subStats.reduce((sum, ss) => {
                    const mapping: [number, number][] = [
                        [0, 10], [1400, 30], [5600, 50], [18000, 70], [40000, 85], [92000, 95], [134000, 98], [156000, 100]
                    ];
                    return sum + interpolate(ss.value, mapping);
                }, 0) / 5);
                
                return {
                    ...s,
                    value: totalValue,
                    rank: mapScoreToRank(avgPercentile),
                    lastIncreased: new Date().toISOString(),
                    subStats
                };
            });

            // Calculate metrics for trait analysis (average percentiles)
            const metrics: any = {
                [StatName.Physical]: (substatsPercentiles[SubStatName.Strength] + substatsPercentiles[SubStatName.Speed] + substatsPercentiles[SubStatName.Endurance] + substatsPercentiles[SubStatName.Dexterity] + substatsPercentiles[SubStatName.Agility]) / 5,
                [StatName.Vitality]: (substatsPercentiles[SubStatName.Stamina] + substatsPercentiles[SubStatName.Regeneration] + substatsPercentiles[SubStatName.Adherence] + substatsPercentiles[SubStatName.Balance] + substatsPercentiles[SubStatName.Longevity]) / 5,
                [StatName.Intelligence]: (substatsPercentiles[SubStatName.Reason] + substatsPercentiles[SubStatName.Knowledge] + substatsPercentiles[SubStatName.Adaptability] + substatsPercentiles[SubStatName.Strategy] + substatsPercentiles[SubStatName.Perception]) / 5,
                [StatName.Creativity]: (substatsPercentiles[SubStatName.Imagination] + substatsPercentiles[SubStatName.Innovation] + substatsPercentiles[SubStatName.Style] + substatsPercentiles[SubStatName.Expression] + substatsPercentiles[SubStatName.Vision]) / 5,
                [StatName.Spirit]: (substatsPercentiles[SubStatName.Faith] + substatsPercentiles[SubStatName.Purpose] + substatsPercentiles[SubStatName.Tranquility] + substatsPercentiles[SubStatName.Empathy] + substatsPercentiles[SubStatName.Conviction]) / 5,
                [StatName.Psyche]: (substatsPercentiles[SubStatName.Resilience] + substatsPercentiles[SubStatName.Charisma] + substatsPercentiles[SubStatName.Focus] + substatsPercentiles[SubStatName.Willpower] + substatsPercentiles[SubStatName.Composure]) / 5,
            };

            const traitResult = performTraitAnalysis(metrics, inputs);
            const codename = generateCodename(gameState?.userName || 'Asset');
            const feats: FullCalibrationReport['noteworthyFeats'] = [];
            if ((equilibrium as any).reasoningScore >= 80) feats.push({ label: 'APEX_REASONING', value: 'S-TIER', rarity: 'Elite', desc: 'Demonstrated exceptional logical and strategic reasoning.' });

            // Generate report with error handling
            let fullReport: any = {
                tpi: 52,
                percentile: 52,
                codename,
                talentClass: traitResult.talentClass || 'Average',
                obsessionLevel: traitResult.obsessionLevel || 'Average',
                archetypeTitle: traitResult.archetypeTitle || 'Seeker',
                mbtiProfile: inputs['mbti-assessment']?.mbtiResult || 'INTJ',
                rarityBand: 'UNCLASSIFIED',
                centralInsight: 'Your profile reveals balanced potential across cognitive and physical domains. Recommend immediate engagement with specialized training protocols to unlock latent capacity.',
                primaryFailureNode: 'Consistency maintenance under extended operational stress',
                failureNodeRisk: 'Prolonged high-intensity tasks without recovery intervals',
                successProbability: 68,
                dropoutProbability: 18,
                biometricModifiers: [
                    'Baseline fitness indicates foundational athletic capacity',
                    'Cognitive performance suggests strategic thinking potential',
                    'Psychological resilience within acceptable parameters'
                ],
                historicalPrecedent: { name: 'Asset Prime', alignment: 'Emerging operative with broad competency', matchPercentage: 71 }
            };
            let finalReport: any = null;

            try {
                const generatedReport = await generateFullCalibrationReport({
                    metrics, traits: traitResult, narrative: inputs['narrative-prompt']?.['narrative-prompt'] || "",
                    mbtType: inputs['mbti-assessment']?.mbtiResult || "INTJ", codename, biometrics: inputs['biometric-data']
                });
                fullReport = { ...generatedReport };
            } catch (e) {
                console.warn('Report generation partial - using defaults', e);
            }

            try {
                console.log('Starting finalReport construction...');
                let scores: any = null;
                try {
                    scores = calculateScores(stats);
                    console.log('✓ Scores calculated:', scores);
                } catch (e) {
                    console.error('✗ calculateScores failed:', e);
                    scores = { apexThreatIndex: 50 };
                }

                let talentDist: any = null;
                try {
                    talentDist = calculateTalentDistribution(metrics, inputs);
                    console.log('✓ Talent distribution calculated');
                } catch (e) {
                    console.error('✗ calculateTalentDistribution failed:', e);
                    talentDist = { dna: [] };
                }

                finalReport = {
                    ...fullReport,
                    ...traitResult,
                    tpi: scores.apexThreatIndex,
                    percentile: scores.apexThreatIndex,
                    overallRank: mapScoreToRank(scores.apexThreatIndex),
                    initialStatsSnapshot: stats,
                    estimatedCeilingRank: calculateCeilingRank(mapScoreToRank(scores.apexThreatIndex), traitResult.talentClass),
                    talentDna: talentDist.dna,
                    noteworthyFeats: feats
                } as FullCalibrationReport;
                setReport(finalReport);
                console.log('✓ Final report set successfully');
            } catch (error) { 
                console.error('Finalization error:', error);
                console.error('Error details:', {
                    errorMessage: (error as any)?.message,
                    errorStack: (error as any)?.stack,
                    statsLength: stats?.length
                });
                // Use the fallback report
                console.warn('Using fallback report...');
                setReport(fullReport as any as FullCalibrationReport);
                addToast("Calibration processed with defaults.", "error"); 
            }
            finally { setIsFinalizing(false); }
        } catch (outerError) { 
            console.error('Outer finalization error:', outerError);
            console.error('Error stack:', (outerError as any)?.stack);
            // Still set a fallback report so users aren't stuck
            const fallbackCodename = generateCodename(gameState?.userName || 'Asset');
            const fallbackReport = {
                tpi: 50,
                percentile: 50,
                codename: fallbackCodename,
                talentClass: 'Seeker',
                obsessionLevel: 'Average',
                archetypeTitle: 'Seeker',
                centralInsight: 'Calibration processed with minimal data. See console for details.',
                historicalPrecedent: { name: 'You', alignment: 'Beginning your Genesis journey', matchPercentage: 0 },
                initialStatsSnapshot: INITIAL_STATS,
                overallRank: 'Initiate',
                estimatedCeilingRank: 'Ascendant',
                talentDna: [],
                noteworthyFeats: []
            } as any as FullCalibrationReport;
            setReport(fallbackReport);
            addToast("Calibration completed with defaults. Check console for details.", "error");
            setIsFinalizing(false);
        }
    };

    const step = CALIBRATION_BENCHMARKS[stepIndex];
    if (report) return <ClassifiedDossier report={report} onProceed={() => seedInitialState(report.initialStatsSnapshot, 0, report, report.initialStatsSnapshot, gameState?.userName, report.talentDna, report.archetypeTitle, allInputs['biometric-data'])} userName={gameState?.userName} />;
    if (isFinalizing) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader text="FINALIZING DOSSIER..." /></div>;
    
    return (
        <div className="h-screen w-screen bg-[#010101] p-2 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-film-grain opacity-10 pointer-events-none" />
            <div className="absolute inset-0 scanline-overlay opacity-15 pointer-events-none" />
            
            {/* Skip Confirmation Modal */}
            {showSkipConfirm && (
                <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-purple-500/30 rounded-sm p-6 max-w-sm w-full space-y-4">
                        <h2 className="text-lg font-orbitron font-bold text-purple-400 uppercase">SKIP OPTIONS</h2>
                        <p className="text-sm text-gray-300">Choose to skip this step or bypass all remaining calibration.</p>
                        <div className="space-y-3">
                            <button
                                onClick={handleSkipStep}
                                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-orbitron uppercase text-xs transition-all rounded-sm"
                            >
                                Skip This Step
                            </button>
                            <button
                                onClick={handleSkipOnboarding}
                                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-orbitron uppercase text-xs transition-all rounded-sm"
                            >
                                Skip All Remaining
                            </button>
                            <button
                                onClick={() => setShowSkipConfirm(false)}
                                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-orbitron uppercase text-xs transition-all rounded-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header - responsive */}
            <div className="w-full mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-2 sm:gap-4 px-2 z-10">
                <h1 className="text-lg sm:text-xl font-orbitron font-black text-white tracking-widest uppercase truncate">
                    Protocol_<span className="text-purple-600">Calibration</span>
                </h1>
                <div className="text-right flex-shrink-0 flex items-end gap-2 sm:gap-4">
                    <button
                        onClick={() => setShowSkipConfirm(true)}
                        className="px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] text-gray-500 hover:text-purple-400 font-mono uppercase tracking-widest border border-gray-700 hover:border-purple-500 rounded-sm transition-colors"
                    >
                        Skip
                    </button>
                    <div>
                        <span className="text-[8px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-widest block">
                            Step {stepIndex + 1} of {CALIBRATION_BENCHMARKS.length}
                        </span>
                        <div className="w-32 sm:w-40 h-1 bg-gray-900 rounded-full mt-1 sm:mt-2 overflow-hidden border border-gray-800">
                            <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${((stepIndex + 1) / CALIBRATION_BENCHMARKS.length) * 100}%` }} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main content - full screen on mobile, constrained on desktop */}
            <div className="w-full h-full sm:h-auto flex-grow sm:max-w-2xl relative z-10">
                {step.type === 'narrative' && <NarrativeInput prompt={step.prompt!} onComplete={handleStepComplete} />}
                {step.type === 'data-entry' && <Questionnaire questions={step.questions!} onComplete={handleStepComplete} />}
                {step.type === 'mbti-test' && <MBTITest onComplete={handleStepComplete} />}
                {step.type === 'hobby-selection' && <HobbySelection onComplete={handleStepComplete} />}
                {step.type === 'questionnaire' && <Questionnaire questions={step.questions!} onComplete={handleStepComplete} />}
                {step.type === 'breath-hold-test' && <BreathHoldTest onComplete={handleStepComplete} />}
                {step.type === 'simon-says' && <SimonSaysTest onComplete={handleStepComplete} />}
                {step.type === 'fitts-law-test' && <FittsLawTest onComplete={handleStepComplete} />}
                {step.type === 'labyrinth-assessment' && <LabyrinthPage onComplete={handleStepComplete} />}
                {step.type === 'resilience-stroop' && <ResilienceStroop onComplete={handleStepComplete} />}
                {step.id === 'ai-adaptive-reasoning' && <EquilibriumReasoningTask onComplete={handleStepComplete} />}
                {step.id === 'adaptive-knowledge-test' && <AdaptiveKnowledgeTest onComplete={handleStepComplete} />}
                {step.id === 'high-stakes-war-room' && <StrategyAssessment3Part onComplete={handleStepComplete} />}
                {step.type === 'dilemma-screening' && <DilemmaScreening onComplete={handleStepComplete} />}
                {step.type === 'creative-protocol-test' && <CreativeProtocolTest onComplete={handleStepComplete} />}
            </div>
        </div>
    );
};
