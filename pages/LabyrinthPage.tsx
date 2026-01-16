
// pages/LabyrinthPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { LABYRINTH_FLOORS } from '../data/labyrinthGameData';
import { SubStatName, LabyrinthSubtest, StatName, AttributeRankName } from '../types';
import { STAT_SUBSTAT_MAP, RANKS } from '../constants';
import Loader from '../components/ui/Loader';
import { BrainCircuit, Zap, RefreshCw, Shield, Swords, Coins, AlertTriangle, SkipForward, ArrowUp, CornerDownLeft, Grid, Target, Wind, Clock, Signal, AlertOctagon, Crosshair, Target as TargetIcon, MoveHorizontal, ShieldAlert, SwordsIcon, TrendingUp, Eye, Crosshair as Scope, Activity, Binary, Cpu, Layers } from 'lucide-react';
import { TerminalShell } from './OnboardingPage';

// --- VISUAL CONTAINERS ---
const LabyrinthTerminal: React.FC<{ children: React.ReactNode; title: string; subtitle?: string; onSkip: () => void }> = ({ children, title, subtitle, onSkip }) => (
    <div className="w-full flex flex-col items-center py-10 animate-in fade-in duration-500">
        <TerminalShell 
            title={`LABYRINTH // ${subtitle?.toUpperCase() || 'CALIBRATION'}`}
            footer={`FLOOR_IDENTIFIED: ${title.toUpperCase()}`}
        >
            <div className="flex flex-col h-full min-h-[500px]">
                <div className="flex justify-between items-center mb-6 border-b border-purple-900/30 pb-2">
                    <h2 className="text-lg font-orbitron font-black text-white tracking-[0.2em]">{title.toUpperCase()}</h2>
                    <button 
                        onClick={onSkip}
                        className="text-[9px] text-gray-600 hover:text-red-500 flex items-center gap-1 transition-colors group"
                    >
                        <SkipForward size={10} /> 
                        <span className="group-hover:underline">BYPASS_PROTOCOL</span>
                    </button>
                </div>
                <div className="flex-grow flex flex-col">
                    {children}
                </div>
            </div>
        </TerminalShell>
    </div>
);

const BriefingScreen: React.FC<{ title: string; desc: string; onStart: () => void }> = ({ title, desc, onStart }) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-4">
        <div className="w-20 h-20 rounded-sm bg-purple-950/20 border border-purple-500 flex items-center justify-center relative overflow-hidden group">
            <BrainCircuit className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent h-full w-full animate-scan" />
        </div>
        <div className="space-y-3">
            <h2 className="text-xl font-black font-orbitron text-white tracking-widest">{title.toUpperCase()}</h2>
            <div className="bg-gray-900/40 p-4 border border-gray-800 rounded-sm max-w-md mx-auto">
                <p className="text-gray-400 text-xs leading-relaxed font-mono italic">"{desc}"</p>
            </div>
        </div>
        <button onClick={onStart} className="w-full max-w-xs bg-purple-600 hover:bg-purple-500 text-white font-black font-orbitron py-4 tracking-[0.3em] rounded-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            INITIATE_ENGINE
        </button>
    </div>
);

// --- ENGINE 2: LOGIC MATRIX (DEDUCTIVE REASONING) ---
const LogicEngine: React.FC<{ test: LabyrinthSubtest, onComplete: (score: number, secondary?: any) => void }> = ({ test, onComplete }) => {
    const [phase, setPhase] = useState<'briefing'|'scrambling'|'active'>('briefing');
    const [grid, setGrid] = useState<boolean[]>(Array(16).fill(false));
    const [moves, setMoves] = useState(0);
    const [par, setPar] = useState(0);
    const [entropyKey, setEntropyKey] = useState('');
    const startTimeRef = useRef(0);
    
    const toggleCell = (index: number, currentGrid: boolean[]) => {
        const newGrid = [...currentGrid];
        const size = 4;
        const row = Math.floor(index / size);
        const col = index % size;
        const toggle = (r: number, c: number) => {
            if (r >= 0 && r < size && c >= 0 && c < size) {
                const idx = r * size + c;
                newGrid[idx] = !newGrid[idx];
            }
        };
        toggle(row, col); toggle(row-1, col); toggle(row+1, col); toggle(row, col-1); toggle(row, col+1);
        return newGrid;
    };

    const handleCellClick = (index: number) => {
        if (phase !== 'active') return;
        const nextGrid = toggleCell(index, grid);
        setGrid(nextGrid);
        setMoves(m => m + 1);
        
        if (nextGrid.every(cell => !cell)) {
            const timeTaken = (performance.now() - startTimeRef.current) / 1000;
            const finalMoves = moves + 1;
            const delta = finalMoves - par;
            
            // --- ELITE SCORING LOGIC ---
            // S: Delta 0 (Moves == Par)
            // SS: Delta 0 + Time < 15s
            // SS+: Delta 0 + Time < 8s
            let score = 0;
            if (delta === 0) {
                if (timeTaken < 8) score = 100; // SS+ Anomaly
                else if (timeTaken < 15) score = 98; // SS
                else score = 92; // S
            } else {
                score = Math.max(20, 85 - (delta * 10)); // Grade A and below
            }
            
            // Resilience: Interaction of Complexity (Par) and Time Spent
            // Someone who finishes too fast gets lower resilience here; 
            // the system assumes they weren't under enough pressure.
            const resilienceScore = Math.min(100, (par * 5) + (timeTaken / 4));

            onComplete(score, { 
                [SubStatName.Resilience]: resilienceScore,
                [SubStatName.Reason]: score 
            });
        }
    };

    const generateValidBoard = useCallback(() => {
        setEntropyKey(Math.random().toString(36).substring(7).toUpperCase());
        let tempGrid = Array(16).fill(false);
        let pulses = new Set<number>();
        
        // COMPLEXITY FLOOR: Ensure 9-13 unique pulses
        const complexityTarget = 9 + Math.floor(Math.random() * 5);
        while (pulses.size < complexityTarget) {
            const idx = Math.floor(Math.random() * 16);
            if (!pulses.has(idx)) {
                pulses.add(idx);
                tempGrid = toggleCell(idx, tempGrid);
            }
        }
        
        setPar(pulses.size);
        setGrid(tempGrid);
        setPhase('active');
        startTimeRef.current = performance.now();
    }, []);

    useEffect(() => {
        if (phase === 'scrambling') {
            const timer = setTimeout(generateValidBoard, 1500);
            return () => clearTimeout(timer);
        }
    }, [phase, generateValidBoard]);

    if (phase === 'briefing') return <BriefingScreen title={test.title} desc={test.description} onStart={() => setPhase('scrambling')} />;

    if (phase === 'scrambling') return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
            <RefreshCw size={48} className="text-purple-500 animate-spin" />
            <div className="text-center">
                <p className="text-xs font-black text-purple-400 font-orbitron tracking-[0.4em] mb-1">COMPLEXITY_FLOOR_VERIFIED</p>
                <p className="text-[10px] text-gray-600 font-mono italic">SEED_ID: {entropyKey}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 opacity-20">
                {Array(16).fill(0).map((_, i) => (
                    <div key={i} className={`w-12 h-12 border border-gray-800 ${Math.random() > 0.5 ? 'bg-purple-900/50' : 'bg-black'}`} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="flex justify-between w-full mb-6 px-4">
                <div className="flex flex-col">
                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Efficiency_Vector</span>
                    <span className="text-xl font-orbitron font-black text-cyan-400">{moves} / <span className="text-gray-500">{par}</span></span>
                    <span className="text-[7px] text-gray-500 font-mono uppercase">Moves / Optimal_Par</span>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Resilience_Log</span>
                    <div className="flex gap-1 mt-1">
                        <Activity size={10} className="text-purple-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-white uppercase">MONITORING_GRIT...</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-8 bg-black/40 p-4 border border-gray-800 rounded-sm shadow-[0_0_50px_rgba(0,0,0,1)] relative group">
                {grid.map((active, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleCellClick(i)}
                        className={`w-14 h-14 rounded-sm border transition-all duration-300 ${active ? 'bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.5)] border-white' : 'bg-gray-900 border-gray-800 hover:border-purple-500/30'}`}
                    />
                ))}
            </div>
            
            <div className="w-full max-w-xs space-y-4">
                <div className="bg-purple-950/10 border border-purple-900/30 p-2 text-center rounded-sm">
                    <p className="text-[8px] text-purple-400 font-black uppercase tracking-[0.2em]">Rank_Thresholds</p>
                    <p className="text-[7px] text-gray-600 font-mono italic">"S: Par Move-Count | SS: Speed & Par | SS+: Anomaly Speed"</p>
                </div>
                <button 
                    onClick={() => onComplete(30, { [SubStatName.Resilience]: 20 })}
                    className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-gray-600 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                    <AlertOctagon size={10} /> REPORT_IMPASSE (SYNC)
                </button>
            </div>
        </div>
    );
};

// --- ENGINE 4: THE MIRAGE ---
const distractors = ['X', '#', '@', '&', '?', '!', '%', 'Δ', 'Ø', '∑', 'Ω'];
const MirageEngine: React.FC<{ test: LabyrinthSubtest, onComplete: (score: number, secondary?: any) => void }> = ({ test, onComplete }) => {
    const [phase, setPhase] = useState<'briefing'|'active'>('briefing');
    const [round, setRound] = useState(1);
    const [grid, setGrid] = useState<string[]>([]);
    const [targetSignal, setTargetSignal] = useState('');
    const [outlierIdx, setOutlierIdx] = useState(-1);
    const [startTime, setStartTime] = useState(0);
    const [latencies, setLatencies] = useState<number[]>([]);
    const [glitchIdx, setGlitchIdx] = useState<number[]>([]);
    const TOTAL_ROUNDS = 10;
    const GRID_DIM = 12;

    const generateGrid = useCallback(() => {
        const pairs = [
            ['O', '0'], ['I', 'l'], ['5', 'S'], ['8', 'B'], ['Z', '2'], ['M', 'W'], ['U', 'V'], ['P', 'R']
        ];
        const [base, outlier] = pairs[Math.floor(Math.random() * pairs.length)];
        const count = GRID_DIM * GRID_DIM; 
        const newGrid = Array(count).fill(base);
        const idx = Math.floor(Math.random() * count);
        newGrid[idx] = outlier;
        setGrid(newGrid);
        setOutlierIdx(idx);
        setTargetSignal(outlier);
        setStartTime(performance.now());
    }, []);

    useEffect(() => {
        if (phase !== 'active') return;
        const interval = setInterval(() => {
            const count = Math.floor(Math.random() * 6);
            const indices = Array.from({length: count}, () => Math.floor(Math.random() * (GRID_DIM * GRID_DIM)));
            setGlitchIdx(indices);
            setTimeout(() => setGlitchIdx([]), 100);
        }, 700);
        return () => clearInterval(interval);
    }, [phase]);

    useEffect(() => {
        if (phase === 'active') generateGrid();
    }, [phase, generateGrid]);

    const handleSelect = (idx: number) => {
        const latency = performance.now() - startTime;
        if (idx === outlierIdx) {
            const nextLatencies = [...latencies, latency];
            setLatencies(nextLatencies);
            if (round >= TOTAL_ROUNDS) {
                const totalLatencyMs = nextLatencies.reduce((a, b) => a + b, 0);
                const totalLatencySeconds = totalLatencyMs / 1000;
                
                // --- ELITE PERFORMANCE THRESHOLDS (PERCEPTION) ---
                // SS: around 35 seconds total
                // S: around 50 seconds total
                // SS+: around 22 seconds total (Anomaly)
                let score = 0;
                if (totalLatencySeconds <= 22) score = 100; // SS+
                else if (totalLatencySeconds <= 35) score = 98; // SS
                else if (totalLatencySeconds <= 50) score = 92; // S
                else {
                    const avgLatency = totalLatencyMs / TOTAL_ROUNDS;
                    score = Math.max(10, 110 - (avgLatency / 100));
                }

                // Resilience impact for Speed: 
                // Someone who clears in 35s proves focus, but less stamina.
                // Resilience = factor of time-on-task.
                const resilienceScore = Math.min(100, (totalLatencySeconds * 2));

                onComplete(score, { 
                    [SubStatName.Perception]: score,
                    [SubStatName.Resilience]: resilienceScore
                });
            } else {
                setRound(r => r + 1);
                generateGrid();
            }
        }
    };

    if (phase === 'briefing') return <BriefingScreen title={test.title} desc={test.description} onStart={() => setPhase('active')} />;

    return (
        <div className="flex flex-col items-center justify-center h-full py-2">
            <div className="flex justify-between w-full text-[10px] font-mono text-purple-400 uppercase mb-2 tracking-tighter">
                <span>SENSOR_GRID: 144_NODES // ROUND: {round}/{TOTAL_ROUNDS}</span>
                <span className="animate-flicker flex items-center gap-1 text-red-500 font-black"><Signal size={10} /> FEED_DISTORTION: ON</span>
            </div>
            
            <div className="w-full bg-purple-900/20 border border-purple-500/30 p-2 mb-4 text-center">
                <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">LOCATE_SIGNAL: </span>
                <span className="text-lg font-black text-white font-mono ml-2">"{targetSignal}"</span>
            </div>

            <div className="grid grid-cols-12 gap-1 bg-black p-2 border border-purple-900/60 relative group shadow-[0_0_40px_rgba(0,0,0,1)] overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 animate-pulse pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent h-4 w-full animate-scan pointer-events-none" />
                {grid.map((char, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(i)}
                        className={`w-6 h-6 flex items-center justify-center text-[10px] font-black font-mono transition-all duration-75
                            ${glitchIdx.includes(i) ? 'text-red-500 bg-red-500/20 scale-125 blur-[0.5px] z-10' : 'text-gray-600 hover:text-white hover:bg-gray-800'}
                            ${i === outlierIdx && 'hover:border hover:border-cyan-500'}
                        `}
                    >
                        {glitchIdx.includes(i) ? distractors[Math.floor(Math.random() * distractors.length)] : char}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold">SIGNAL_DETECTION_THROUGH_STATIC</p>
                <div className="flex gap-1">
                    {Array.from({length: TOTAL_ROUNDS}).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < round - 1 ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-gray-800'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- ENGINE 6: SNIPER EYE ---
const SniperEngine: React.FC<{ test: LabyrinthSubtest, onComplete: (score: number, secondary?: any) => void }> = ({ test, onComplete }) => {
    const [phase, setPhase] = useState<'briefing'|'active'>('briefing');
    const [round, setRound] = useState(1);
    const [strikes, setStrikes] = useState(0);
    const [linePos, setLinePos] = useState(0); 
    const [targetPos, setTargetPos] = useState(50);
    const [flash, setFlash] = useState<'hit'|'miss'|null>(null);
    const [wobble, setWobble] = useState(0);
    
    const requestRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);
    const directionRef = useRef<number>(1);
    const precisionScoresRef = useRef<number[]>([]);
    const roundRef = useRef<number>(1);
    const strikesRef = useRef<number>(0);
    
    const TOTAL_ROUNDS = 15; 
    const MAX_STRIKES = 3;

    const getSpeed = (r: number) => {
        return 0.5 + Math.pow(r / TOTAL_ROUNDS, 1.8) * 3.5;
    };
    
    const getTargetWidth = (r: number) => {
        return 18 - Math.pow(r / TOTAL_ROUNDS, 1.6) * 12;
    };

    const finalize = useCallback((finalRound: number, finalStrikes: number, scores: number[]) => {
        const roundsCleared = finalRound - (finalStrikes >= MAX_STRIKES ? 1 : 0);
        const composureScore = (roundsCleared / TOTAL_ROUNDS) * 100;
        const focusScore = scores.length > 0 
            ? (scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;
        const dexterityScore = (composureScore * 0.5) + (focusScore * 0.5);
        
        onComplete(dexterityScore, { 
            [SubStatName.Dexterity]: dexterityScore,
            [SubStatName.Focus]: focusScore,
            [SubStatName.Composure]: composureScore,
            roundsCleared,
            totalPrecision: focusScore
        });
    }, [onComplete]);

    const animate = useCallback((time: number) => {
        if (lastUpdateRef.current !== undefined) {
            const deltaTime = time - lastUpdateRef.current;
            const speed = getSpeed(roundRef.current);
            const wobbleForce = Math.sin(time / (450 - roundRef.current * 5)) * (roundRef.current * 0.06);
            setWobble(wobbleForce);
            setLinePos(prev => {
                let next = prev + (directionRef.current * speed * (deltaTime / 16));
                if (next >= 100) { next = 100; directionRef.current = -1; } 
                else if (next <= 0) { next = 0; directionRef.current = 1; }
                return next;
            });
        }
        lastUpdateRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    const handleAction = () => {
        if (phase !== 'active' || flash) return;
        
        const targetWidth = getTargetWidth(roundRef.current);
        const halfWidth = targetWidth / 2;
        const distFromCenter = Math.abs(linePos + wobble - targetPos);
        
        if (distFromCenter <= halfWidth) {
            // HIT
            const precision = Math.max(0, 100 - (distFromCenter / halfWidth * 100));
            precisionScoresRef.current.push(precision);
            setFlash('hit');
            
            setTimeout(() => {
                setFlash(null);
                if (roundRef.current >= TOTAL_ROUNDS) {
                    finalize(roundRef.current, strikesRef.current, precisionScoresRef.current);
                } else {
                    roundRef.current += 1;
                    setRound(roundRef.current);
                    setTargetPos(20 + Math.random() * 60);
                    setLinePos(Math.random() > 0.5 ? 0 : 100);
                    directionRef.current = linePos > 50 ? -1 : 1;
                }
            }, 180);
        } else {
            // MISS
            strikesRef.current += 1;
            setStrikes(strikesRef.current);
            setFlash('miss');
            
            setTimeout(() => {
                setFlash(null);
                if (strikesRef.current >= MAX_STRIKES) {
                    finalize(roundRef.current, strikesRef.current, precisionScoresRef.current);
                }
            }, 250);
        }
    };

    useEffect(() => {
        if (phase === 'active' && !flash) {
            requestRef.current = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(requestRef.current);
        }
    }, [phase, animate, flash]);

    if (phase === 'briefing') return <BriefingScreen title={test.title} desc={test.description} onStart={() => setPhase('active')} />;

    const isOverdrive = round > 11;
    return (
        <div className="flex flex-col items-center h-full py-4 space-y-6 select-none cursor-crosshair" onClick={handleAction}>
            <div className="flex justify-between w-full max-w-md text-[10px] font-mono font-bold uppercase border-b border-purple-900/30 pb-2">
                <div className="flex items-center gap-4">
                    <span className={`transition-colors ${isOverdrive ? 'text-red-500 animate-pulse' : 'text-purple-400'}`}>RAIL_ROUND: {round.toString().padStart(2, '0')}</span>
                    <span className="text-gray-600">|</span>
                    <span className="flex items-center gap-1 text-red-500">STRIKES: {Array(MAX_STRIKES).fill(0).map((_,i) => (
                        <span key={i} className={i < strikes ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 'text-gray-800'}>✖</span>
                    ))}</span>
                </div>
                <span className="animate-pulse text-cyan-400 flex items-center gap-1"><Activity size={10} /> FLOW_STABILIZED</span>
            </div>
            <div className={`relative w-full h-64 bg-black border border-gray-800 rounded-sm overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)] flex items-center group transition-all duration-300 ${isOverdrive ? 'border-red-900/50' : ''}`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-500" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-500" />
                </div>
                <div className={`absolute h-48 border-x transition-all duration-150 flex items-center justify-center ${flash === 'miss' ? 'bg-red-600/40 border-red-400 shadow-[0_0_30px_red]' : 'bg-purple-500/10 border-purple-500/40'}`} style={{ left: `${targetPos}%`, width: `${getTargetWidth(round)}%`, transform: 'translateX(-50%)' }}>
                    <Scope size={24} className={`transition-opacity ${flash === 'hit' ? 'text-green-400 opacity-100' : 'text-purple-500/20'}`} />
                </div>
                <div className={`absolute top-0 bottom-0 w-1 transition-shadow duration-75 flex flex-col justify-between items-center ${flash === 'hit' ? 'bg-green-400 shadow-[0_0_40px_#4ade80]' : 'bg-cyan-400 shadow-[0_0_20px_#22d3ee]'}`} style={{ left: `${linePos + wobble}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-4 h-4 bg-current rotate-45 -translate-y-2" />
                    <div className="w-4 h-4 bg-current rotate-45 translate-y-2" />
                </div>
                {flash && <div className={`absolute inset-0 animate-pulse pointer-events-none ${flash === 'hit' ? 'bg-green-500/20' : 'bg-red-500/30'}`} />}
            </div>
            <div className="text-center space-y-3 w-full flex flex-col items-center">
                <p className="text-[10px] text-white font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <TargetIcon size={12} className={isOverdrive ? 'text-red-500' : 'text-purple-500'} /> NEURAL_LINK READY
                </p>
                <div className="w-full bg-gray-900 h-1.5 rounded-full max-w-xs overflow-hidden border border-gray-800">
                    <div className={`h-full transition-all duration-300 ${isOverdrive ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-purple-600 shadow-[0_0_10px_#a855f7]'}`} style={{width: `${(round/TOTAL_ROUNDS)*100}%`}} />
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const LabyrinthPage: React.FC<{ onComplete?: (results: any) => void }> = ({ onComplete }) => {
    const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
    const [activeTestId, setActiveTestId] = useState<string | null>(null);
    const [assessmentStep, setAssessmentStep] = useState(0);
    const [assessmentScores, setAssessmentScores] = useState<Record<string, number>>({});
    const ASSESSMENT_SEQUENCE = ['floor-2', 'floor-4', 'floor-6']; 

    useEffect(() => {
        if (onComplete && activeFloorId === null) {
            const floorId = ASSESSMENT_SEQUENCE[0]; setActiveFloorId(floorId);
            const floor = LABYRINTH_FLOORS.find(f => f.id === floorId);
            if(floor) setActiveTestId(floor.subtests[0].id);
        }
    }, [onComplete]);

    const handleTestComplete = (score: number, secondary?: any) => {
        const floor = LABYRINTH_FLOORS.find(f => f.id === activeFloorId);
        const test = floor?.subtests.find(t => t.id === activeTestId);
        if (test) {
            const scoresFromTest: Record<string, number> = {};
            test.substats.forEach(ss => { scoresFromTest[ss] = score; });
            const newScores = { ...assessmentScores, ...scoresFromTest, ...secondary };
            setAssessmentScores(newScores);
            if (assessmentStep < ASSESSMENT_SEQUENCE.length - 1) {
                const nextStep = assessmentStep + 1; setAssessmentStep(nextStep);
                const nextFloorId = ASSESSMENT_SEQUENCE[nextStep]; setActiveFloorId(nextFloorId);
                const nextFloor = LABYRINTH_FLOORS.find(f => f.id === nextFloorId);
                setActiveTestId(nextFloor?.subtests[0].id || null);
            } else onComplete?.({ 'psychometric-evaluation': newScores });
        }
    };

    if (activeFloorId && activeTestId) {
        const floor = LABYRINTH_FLOORS.find(f => f.id === activeFloorId);
        const test = floor?.subtests.find(t => t.id === activeTestId);
        if (test) return (
            <LabyrinthTerminal title={test.title} subtitle={floor?.title} onSkip={() => handleTestComplete(15)}>
                {test.uiMode === 'logic_grid' && <LogicEngine test={test} onComplete={handleTestComplete} />}
                {test.uiMode === 'flux_reaction' && <MirageEngine test={test} onComplete={handleTestComplete} />}
                {test.uiMode === 'stress_clock' && <SniperEngine test={test} onComplete={handleTestComplete} />}
            </LabyrinthTerminal>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-black font-orbitron text-center mb-10 tracking-[0.2em] text-white uppercase">Protocol_Labyrinth</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {LABYRINTH_FLOORS.filter(f => ASSESSMENT_SEQUENCE.includes(f.id)).map(floor => (
                    <div key={floor.id} className="hud-card p-6 cursor-pointer hover:border-purple-600 transition-all group" onClick={() => { setActiveFloorId(floor.id); setActiveTestId(floor.subtests[0].id); }}>
                        <h3 className="text-lg font-black font-orbitron text-purple-400 mb-1 tracking-wider uppercase">{floor.title}</h3>
                        <p className="text-[10px] text-gray-500 mb-4 font-mono">{floor.subtitle.toUpperCase()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabyrinthPage;
