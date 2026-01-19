
// components/ClassifiedDossier.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FullCalibrationReport, TalentDna, TalentClass, ObsessionLevel, AttributeRankName } from '../types';
import { Fingerprint, ShieldAlert, Zap, TrendingUp, BrainCircuit, Target, AlertTriangle, History, Activity, Database, Cpu, Search, Lock, UserCheck, ShieldCheck, ChevronRight, Binary, Signal, AlertOctagon, Star, Award, Shield } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface ClassifiedDossierProps {
    report: FullCalibrationReport;
    onProceed?: () => void;
    isModal?: boolean;
    userName?: string;
}

const rankGlowMap: Record<AttributeRankName, string> = {
    'E': 'shadow-gray-900',
    'D': 'shadow-green-900/40',
    'C': 'shadow-blue-900/40',
    'B': 'shadow-purple-900/40',
    'A': 'shadow-indigo-900/60',
    'S': 'shadow-amber-900/60',
    'SS': 'shadow-red-900/80',
    'SS+': 'shadow-cyan-900/80',
};

const SingularityMap: React.FC<{ talentClass: TalentClass; obsessionLevel: ObsessionLevel; drive: number }> = ({ talentClass, obsessionLevel, drive }) => {
    const xMap: Record<ObsessionLevel, number> = { 
        'Lazy': 15, 'Average': 35, 'Locked-In': 55, 'Relentless': 80, 'Compulsive': 94 
    };
    const yMap: Record<TalentClass, number> = { 
        'Laggard': 15, 'Average': 35, 'Talented Learner': 55, 'Gifted': 80, 'Genius': 94 
    };
    
    const userX = xMap[obsessionLevel];
    const userY = yMap[talentClass];
    
    const vectorStrength = drive * 15;
    const projectedPoint = { 
        x: Math.min(98, userX + (vectorStrength * 0.2)), 
        y: Math.min(98, userY + vectorStrength) 
    };

    return (
        <div className="relative w-full h-full bg-[#050505] border border-purple-900/30 rounded-sm overflow-hidden group">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.03] pointer-events-none z-0">
                <div className="border-r border-b border-white p-4"><span className="text-[10px] font-black uppercase">Stagnant Reservoir</span></div>
                <div className="border-b border-white p-4 text-right"><span className="text-[10px] font-black uppercase text-purple-500">Apex Convergence</span></div>
                <div className="border-r border-white p-4 flex items-end"><span className="text-[10px] font-black uppercase">Functional Baseline</span></div>
                <div className="p-4 flex items-end justify-end"><span className="text-[10px] font-black uppercase text-cyan-400">Transcendent Burnout</span></div>
            </div>

            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                    <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                    <filter id="nodeGlow">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {[20, 40, 60, 80].map(val => (
                    <React.Fragment key={val}>
                        <line x1={val} y1="0" x2={val} y2="100" stroke="#1a1a1a" strokeWidth="0.2" />
                        <line x1="0" y1={val} x2="100" y2={val} stroke="#1a1a1a" strokeWidth="0.2" />
                    </React.Fragment>
                ))}

                <line 
                    x1={userX} y1={100 - userY} 
                    x2={projectedPoint.x} y2={100 - projectedPoint.y} 
                    stroke="#a855f7" 
                    strokeWidth="0.5" 
                    strokeDasharray="1,1"
                    className="animate-pulse"
                />
                
                <g transform={`translate(${userX}, ${100 - userY})`}>
                    <circle r="4" fill="url(#apexGlow)" />
                    <circle r="1.5" fill="#a855f7" filter="url(#nodeGlow)">
                        <animate attributeName="r" values="1.2;1.8;1.2" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="3" y="-3" fontSize="2" fill="#fff" fontWeight="900" className="font-orbitron">ACTIVE_ASSET</text>
                </g>
                
                {[
                    { x: 95, y: 92, label: 'LEONARDO' },
                    { x: 92, y: 35, label: 'GOGGINS' },
                    { x: 50, y: 50, label: 'MEAN_HUMAN' },
                    { x: 85, y: 78, label: 'ELITE_OP' }
                ].map((ref, i) => (
                    <g key={i} transform={`translate(${ref.x}, ${100 - ref.y})`} opacity="0.2">
                        <rect x="-0.5" y="-0.5" width="1" height="1" fill="#444" />
                        <text x="1.5" y="0.5" fontSize="1.5" fill="#666" className="font-mono">{ref.label}</text>
                    </g>
                ))}
            </svg>
            
            <div className="absolute bottom-2 right-2 flex flex-col items-end">
                <span className="text-[7px] text-gray-700 font-black uppercase tracking-[0.3em]">Neural_Vector_Correlation</span>
                <span className="text-[6px] text-purple-900 font-bold uppercase italic">Simulating 6-Month Trajectory...</span>
            </div>
        </div>
    );
};

export const ClassifiedDossier: React.FC<ClassifiedDossierProps> = ({ report, onProceed, isModal = false, userName = "UNKNOWN" }) => {
    const [clearance, setClearance] = useState(0);
    const [isScanning, setIsScanning] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 2800);
        return () => clearTimeout(timer);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollPercent = e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight);
        if (scrollPercent > 0.1) setClearance(1);
        if (scrollPercent > 0.4) setClearance(2);
        if (scrollPercent > 0.7) setClearance(3);
    };

    if (isScanning && !isModal) {
        return (
            <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center font-mono">
                <div className="bg-film-grain !opacity-40" />
                <div className="biometric-scan-line" />
                <div className="grid-background absolute inset-0 opacity-10" />
                <div className="relative p-10 border border-purple-500/20 bg-purple-950/5">
                    <Fingerprint size={80} className="text-purple-500 animate-pulse mb-6" strokeWidth={1} />
                    <div className="space-y-2 text-center">
                        <p className="text-purple-400 text-xs tracking-[0.5em] font-black animate-flicker uppercase">identity_matrix_synchronization</p>
                        <div className="h-1 w-48 bg-gray-900 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-purple-600 animate-[loading_2.5s_ease-in-out_forwards]" style={{width: '0%'}} />
                        </div>
                        <p className="text-[8px] text-gray-600 mt-2 font-black tracking-widest">ASSET_UID: {userName.toUpperCase()}</p>
                    </div>
                </div>
                <style>{`
                    @keyframes loading {
                        0% { width: 0%; }
                        20% { width: 15%; }
                        45% { width: 60%; }
                        80% { width: 95%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="relative w-full h-full flex flex-col bg-[#010101] text-gray-300 font-mono overflow-hidden vignette transition-all duration-1000"
        >
            <div className="bg-film-grain !opacity-15 pointer-events-none z-[100]" />
            <div className="absolute inset-0 pointer-events-none scanline-overlay z-40" />
            <div className="grid-background absolute inset-0 pointer-events-none" />

            <header className="flex-shrink-0 border-b border-purple-900/30 bg-black/95 p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-red-600 text-[10px] font-black tracking-[0.4em] animate-pulse">
                            <ShieldAlert size={14} /> SECURITY_CLEARANCE: LVL_9
                        </div>
                        <h1 className="text-2xl font-black font-orbitron text-gray-100 tracking-[0.2em] uppercase chromatic-aberration">
                            ASSET_FILE: <span className="text-purple-600">GP-0{report.tpi}</span>
                        </h1>
                        <div className="flex gap-6 mt-2 text-[9px] text-gray-500 font-mono tracking-tighter">
                            <span>OPERATIVE: <span className="text-cyan-400 font-bold">{userName.toUpperCase()}</span></span>
                            <span>CODENAME: <span className="text-purple-400 font-bold">{report.codename.toUpperCase()}</span></span>
                        </div>
                    </div>
                </div>
                <div className="text-right flex items-center gap-6">
                    <div className="classified-stamp-red hidden md:block">GENESIS_PROTOCOL</div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-purple-400 font-black tracking-widest">{report.codename.toUpperCase()}</span>
                            <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">STATUS: CALIBRATED_ACTIVE</span>
                        </div>
                        <div className="re-light" />
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 md:p-10 max-w-6xl mx-auto w-full space-y-12 pb-32">
                
                {/* SECTION 1: HARDWARE & BIOMETRICS */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-center border-l-4 border-purple-600 pl-4">
                        <div className="flex items-center gap-4">
                            <span className="bg-purple-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_01</span>
                            <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Hardware Diagnostics</h2>
                        </div>
                        <div className="bg-red-950/20 border border-red-500/30 px-3 py-1 text-[9px] text-red-500 font-black font-orbitron tracking-widest">
                            EYES ONLY
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className={`lg:col-span-4 bg-gray-900/10 border border-gray-800 p-8 flex flex-col items-center justify-center relative text-center group hover:border-purple-500/30 transition-all ${rankGlowMap[report.overallRank]} shadow-2xl overflow-hidden`}>
                            <div className="absolute inset-0 bg-film-grain !opacity-5" />
                            <div className="absolute top-2 left-2 text-[6px] text-gray-700 font-black uppercase font-mono">Sig_Analysis: ACTIVE</div>
                            <div className="relative w-40 h-40 text-purple-600/10 mb-6">
                                <Fingerprint className="w-full h-full" strokeWidth={0.5} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-1 animate-scan" />
                                <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500 opacity-20 group-hover:opacity-60 transition-opacity" size={40} />
                            </div>
                            <h3 className="text-2xl font-black font-orbitron text-white tracking-widest uppercase">{report.archetypeTitle}</h3>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[8px] font-black border border-purple-500/50 px-2 py-0.5 text-purple-400 uppercase tracking-tighter">{report.rarityBand}</span>
                                <span className="text-[8px] font-black border border-cyan-500/50 px-2 py-0.5 text-cyan-400 uppercase tracking-tighter">MBTI: {report.mbtiProfile.split(':')[0] || 'UNK'}</span>
                            </div>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black border border-gray-800 p-4 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1"><Activity size={10} /> Apex Threat</span>
                                <div className="text-5xl font-black font-orbitron text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" style={{ transform: 'rotate(-2deg)' }}>{report.tpi}%</div>
                                <div className="text-[10px] text-cyan-500 font-bold font-mono">GRADE_{report.overallRank}</div>
                            </div>
                            <div className="bg-black border border-gray-800 p-4 flex flex-col justify-between group hover:border-purple-500/50 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1"><UserCheck size={10} /> Talent Class</span>
                                <div className="text-xl font-black font-orbitron text-purple-400">{report.talentClass.toUpperCase()}</div>
                                <div className="text-[8px] text-gray-600 font-bold uppercase italic mt-1 tracking-tighter">Growth_Multiplier: x1.{report.talentDna.LV.toString().split('.')[1] || '4'}</div>
                            </div>
                            <div className="bg-black border border-gray-800 p-4 flex flex-col justify-between group hover:border-red-500/50 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1"><Zap size={10} /> Obsession</span>
                                <div className="text-xl font-black font-orbitron text-red-500">{report.obsessionLevel.toUpperCase()}</div>
                                <div className="text-[8px] text-gray-600 font-bold uppercase italic mt-1">Adherence_Prob: {report.successProbability}%</div>
                            </div>
                            <div className="bg-black border border-gray-800 p-4 flex flex-col justify-between group hover:border-green-500/50 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1"><Search size={10} /> Rarity Index</span>
                                <div className="text-xl font-black font-orbitron text-green-400">{report.rarity}</div>
                                <div className="text-[8px] text-gray-600 font-bold uppercase italic mt-1 tracking-tighter">Population_Density</div>
                            </div>
                        </div>
                    </div>

                    {/* PERFORMANCE ANOMALIES */}
                    {report.noteworthyFeats && report.noteworthyFeats.length > 0 && (
                        <div className="bg-gray-900/5 border border-purple-900/30 p-6 rounded-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.02]" />
                            <h3 className="text-purple-400 font-black text-[9px] tracking-[0.4em] uppercase mb-4 flex items-center gap-2">
                                <Star size={12} /> Signature Performance Feats
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {report.noteworthyFeats.map((feat, i) => (
                                    <div key={i} className="bg-black/60 border border-gray-800 p-3 rounded-sm flex items-start gap-3 group hover:border-purple-500/50 transition-all">
                                        <div className={`p-2 rounded-sm ${feat.rarity === 'Mythic' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                            {feat.rarity === 'Mythic' ? <Award size={16} /> : <Shield size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase">{feat.label}: {feat.value}</p>
                                            <p className="text-[9px] text-gray-500 italic mt-0.5 leading-tight">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* SECTION 2: NEURAL ARCHITECTURE & COMPARATIVE MAPPING */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="flex items-center gap-4 border-l-4 border-cyan-600 pl-4">
                        <span className="bg-cyan-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Neural architecture mapping</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                        <div className="lg:col-span-8 relative">
                             <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                                <span className="text-[10px] text-white font-black bg-purple-900/80 px-2 py-0.5 flex items-center gap-2"><TrendingUp size={12} /> POTENTIAL SINGULARITY PLOT</span>
                                <span className="text-[7px] text-gray-500 font-mono italic tracking-tighter">CROSS-VECTOR ANALYSIS OF INNATE TALENT VS. BEHAVIORAL OBSESSION</span>
                             </div>
                             <SingularityMap 
                                talentClass={report.talentClass} 
                                obsessionLevel={report.obsessionLevel} 
                                drive={report.talentDna.DR} 
                             />
                        </div>
                        <div className="lg:col-span-4 bg-black/40 border border-gray-800 p-6 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.04]" />
                            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 text-center">Comparative Performance Index</h3>
                            <div className="flex-grow w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                                        { s: 'Potential', A: report.talentDna.BP * 100, B: 45 },
                                        { s: 'Velocity', A: report.talentDna.LV * 100, B: 30 },
                                        { s: 'Drive', A: report.talentDna.DR * 100, B: 50 },
                                    ]}>
                                        <PolarGrid stroke="#222" />
                                        <PolarAngleAxis dataKey="s" tick={{ fill: '#444', fontSize: 8, fontWeight: 900 }} />
                                        <PolarRadiusAxis domain={[0, 100]} hide />
                                        {/* Baseline Human Shadow */}
                                        <Radar name="Mean Human" dataKey="B" stroke="#444" fill="#444" fillOpacity={0.1} />
                                        {/* Asset Stats */}
                                        <Radar name="Active Asset" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} strokeWidth={2} />
                                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                                <div className="absolute bottom-0 left-0 right-0 text-center">
                                    <span className="text-[8px] text-gray-600 font-bold uppercase">Shadow Area: General Population Mean</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-purple-900/10 border-l border-purple-500 w-full relative z-10">
                                <p className="text-[8px] text-purple-400 font-bold uppercase leading-relaxed tracking-tighter">
                                    <Signal size={10} className="inline mr-1" /> Vector Analysis:
                                    Current learning trajectory suggests an efficiency curve of {Math.round(report.talentDna.LV * 100)}%. System bottleneck identified at {report.talentDna.DR < 0.5 ? 'Drive Threshold' : 'Base Bandwidth'}.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: SYSTEM WARNINGS & STRATEGIC INSIGHT */}
                <section className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex items-center gap-4 border-l-4 border-red-600 pl-4">
                        <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_03</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Neural Friction & Critical Failures</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1a0505] border border-red-900/50 p-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.06]" />
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><AlertTriangle size={60} className="text-red-500" /></div>
                            <h3 className="text-red-500 font-black text-[10px] tracking-[0.4em] mb-4 flex items-center gap-2 uppercase">
                                <AlertOctagon size={16} /> [SYSTEM_VULNERABILITY]
                            </h3>
                            <p className="text-xl font-black font-orbitron text-red-200 uppercase mb-2 tracking-widest">{report.primaryFailureNode}</p>
                            <div className="bg-black/60 p-4 border border-red-900/30 rounded-sm">
                                <p className="text-[10px] text-red-400 font-mono leading-relaxed italic uppercase font-bold">
                                    Trigger conditions detected: "{report.failureNodeRisk}"
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase">
                                <Activity size={10} /> Impact Severity: <span className="text-red-600 font-black">CRITICAL</span>
                            </div>
                        </div>

                        <div className="bg-[#051a1a] border border-cyan-900/50 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.06]" />
                            <h3 className="text-cyan-500 font-black text-[10px] tracking-[0.4em] mb-4 flex items-center gap-2 uppercase">
                                <History size={16} /> [HISTORICAL_PRECEDENT]
                            </h3>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-cyan-950/50 border border-cyan-800 flex items-center justify-center text-cyan-400 font-orbitron font-black text-2xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                    {report.historicalPrecedent?.name.charAt(0) || 'Ø'}
                                </div>
                                <div>
                                    <p className="text-xl font-black font-orbitron text-white uppercase tracking-wider">{report.historicalPrecedent?.name}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold mt-1 uppercase tracking-tighter">
                                        <Signal size={10} /> {report.historicalPrecedent?.matchPercentage || 85}% Alignment
                                    </div>
                                    <p className="text-[9px] text-gray-500 mt-2 italic leading-tight">"{report.historicalPrecedent?.alignment}"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-purple-900/40 p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-film-grain !opacity-[0.08]" />
                        <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12"><Database size={300} /></div>
                        <h3 className="text-purple-600 font-black text-[11px] font-orbitron tracking-[0.5em] mb-10 flex items-center gap-3 uppercase">
                            <Database size={18} /> [CENTRAL_QUALITATIVE_EVALUATION]
                        </h3>
                        <div 
                            className="prose prose-invert max-w-none text-gray-300 font-mono text-sm leading-relaxed tracking-tight decrypting-text relative z-10"
                            dangerouslySetInnerHTML={{ __html: report.centralInsight.replace(/\*\*(.*?)\*\*/g, '<span class="text-purple-400 font-black tracking-tighter px-1 bg-purple-950/20">$1</span>').replace(/\*(.*?)\*/g, '<i class="text-cyan-400">$1</i>') }}
                        />
                    </div>
                </section>

                {/* SECTION 4: GROWTH VECTORS & POTENTIAL */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-400">
                    <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4">
                        <span className="bg-indigo-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_04</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Growth Vectors & Potential Ceiling</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/50 border border-indigo-900/50 p-6 relative overflow-hidden group hover:border-indigo-500/70 transition-colors">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                            <h3 className="text-indigo-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                <TrendingUp size={14} /> Talent Class Vector
                            </h3>
                            <div className="relative z-10">
                                <p className="text-3xl font-black font-orbitron text-indigo-300 mb-2">{report.talentClass}</p>
                                <div className="bg-indigo-950/40 p-3 border border-indigo-800/40 rounded-sm text-[9px] text-indigo-300 font-mono space-y-1">
                                    <p><span className="text-indigo-500 font-black">XP Multiplier:</span> {report.talentDna.LV >= 0.9 ? '2.0x' : report.talentDna.LV >= 0.75 ? '1.6x' : report.talentDna.LV >= 0.6 ? '1.3x' : '1.0x'}</p>
                                    <p><span className="text-indigo-500 font-black">Percentile:</span> {Math.round(report.talentDna.LV * 100)}th</p>
                                    <p><span className="text-indigo-500 font-black">Status:</span> IMMUTABLE (until promotion)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/50 border border-amber-900/50 p-6 relative overflow-hidden group hover:border-amber-500/70 transition-colors">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                            <h3 className="text-amber-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                <Zap size={14} /> Obsession Level Vector
                            </h3>
                            <div className="relative z-10">
                                <p className="text-3xl font-black font-orbitron text-amber-300 mb-2">{report.obsessionLevel}</p>
                                <div className="bg-amber-950/40 p-3 border border-amber-800/40 rounded-sm text-[9px] text-amber-300 font-mono space-y-1">
                                    <p><span className="text-amber-500 font-black">Adherence:</span> {report.successProbability}%</p>
                                    <p><span className="text-amber-500 font-black">Percentile:</span> {Math.round(report.talentDna.DR * 100)}th</p>
                                    <p><span className="text-amber-500 font-black">Status:</span> MUTABLE (with practice)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/50 border border-cyan-900/50 p-6 relative overflow-hidden group hover:border-cyan-500/70 transition-colors">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                            <h3 className="text-cyan-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                <Target size={14} /> Potential Ceiling
                            </h3>
                            <div className="relative z-10">
                                <p className="text-2xl font-black font-orbitron text-cyan-300 mb-2">
                                    {report.talentClass === 'Genius' && report.obsessionLevel === 'Compulsive' ? 'SINGULARITY' : report.talentClass === 'Genius' ? 'S+/SS' : report.obsessionLevel === 'Compulsive' ? 'S' : 'A-B'}
                                </p>
                                <div className="bg-cyan-950/40 p-3 border border-cyan-800/40 rounded-sm text-[9px] text-cyan-300 font-mono space-y-1">
                                    <p><span className="text-cyan-500 font-black">Trajectory:</span> {report.talentDna.DR > 0.7 ? 'Exponential' : 'Linear'}</p>
                                    <p><span className="text-cyan-500 font-black">Timeline:</span> {report.talentDna.DR > 0.8 ? '3-6 weeks' : '3-6 months'}</p>
                                    <p><span className="text-cyan-500 font-black">Burnout:</span> {report.obsessionLevel === 'Compulsive' ? 'Negligible' : report.obsessionLevel === 'Locked-In' ? 'Low' : 'High'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-950/20 border border-indigo-900/40 p-6 rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-film-grain !opacity-[0.02]" />
                        <p className="text-[10px] text-indigo-300 font-mono leading-relaxed relative z-10">
                            <span className="text-indigo-500 font-black">ANALYSIS:</span> Your talent class defines learning velocity; your obsession level determines consistency. The combination dictates your theoretical maximum. {report.talentClass === 'Genius' && report.obsessionLevel === 'Compulsive' && 'Singularity-tier asset—exponential ceiling detected.'} {report.obsessionLevel === 'Compulsive' && report.talentClass !== 'Genius' && 'Effort-driven asset—will eventually exceed naturally talented peers.'} {report.talentClass === 'Genius' && report.obsessionLevel !== 'Compulsive' && 'Natural talent without discipline—will hit ceiling without external accountability.'}
                        </p>
                    </div>
                </section>

                {/* SECTION 5: SIGNATURE ACHIEVEMENTS & RARE FEATS */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-500">
                    <div className="flex items-center gap-4 border-l-4 border-yellow-600 pl-4">
                        <span className="bg-yellow-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_05</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Signature Achievements & Rare Markers</h2>
                    </div>

                    {report.noteworthyFeats && report.noteworthyFeats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {report.noteworthyFeats.map((feat, i) => (
                                <div key={i} className={`bg-black/60 border p-6 relative overflow-hidden group hover:scale-105 transition-all ${feat.rarity === 'Mythic' ? 'border-amber-600/60 hover:border-amber-400' : 'border-purple-600/60 hover:border-purple-400'}`}>
                                    <div className="absolute inset-0 bg-film-grain !opacity-[0.04]" />
                                    <div className="absolute -top-6 -right-6 opacity-5 group-hover:opacity-15 transition-opacity">
                                        {feat.rarity === 'Mythic' ? <Award size={80} className="text-amber-500" /> : <Shield size={80} className="text-purple-500" />}
                                    </div>
                                    <div className="relative z-10">
                                        <div className={`inline-block px-3 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase mb-4 ${feat.rarity === 'Mythic' ? 'bg-amber-900/40 text-amber-400 border border-amber-600/40' : 'bg-purple-900/40 text-purple-400 border border-purple-600/40'}`}>
                                            {feat.rarity} ACHIEVEMENT
                                        </div>
                                        <p className="text-lg font-black font-orbitron text-white uppercase tracking-wider mb-2">{feat.label}</p>
                                        <p className={`text-sm font-black font-orbitron mb-3 ${feat.rarity === 'Mythic' ? 'text-amber-300' : 'text-purple-300'}`}>{feat.value}</p>
                                        <p className="text-[9px] text-gray-400 leading-relaxed italic">{feat.desc}</p>
                                        <div className="mt-3 pt-3 border-t border-gray-800">
                                            <p className="text-[8px] text-gray-600 font-mono uppercase tracking-tighter">Impact: Permanently recorded on asset profile</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-black/50 border border-gray-800 p-8 text-center rounded-sm">
                            <div className="text-gray-600 mb-3"><Award size={32} className="mx-auto opacity-30" /></div>
                            <p className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">No mythic achievements detected in this session.</p>
                            <p className="text-[9px] text-gray-600 italic mt-2">Signature feats are recorded when performance exceeds 95th percentile thresholds.</p>
                        </div>
                    )}
                </section>

                {/* SECTION 6: FINAL CLASSIFICATION & OPERATIONAL DIRECTIVE */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-600">
                    <div className="flex items-center gap-4 border-l-4 border-white pl-4">
                        <span className="bg-white text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_06</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Operational Classification & Final Directive</h2>
                    </div>

                    <div className="bg-gradient-to-r from-purple-950/40 via-black to-cyan-950/40 border border-purple-800/60 p-10 relative overflow-hidden rounded-sm shadow-2xl">
                        <div className="absolute inset-0 bg-film-grain !opacity-[0.08]" />
                        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-purple-400 font-black text-[11px] tracking-[0.5em] uppercase mb-4 flex items-center gap-3">
                                    <ShieldCheck size={18} /> Classification Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-black/60 border border-purple-800/40 p-4 rounded-sm">
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">ASSET_CLASS</p>
                                        <p className="text-2xl font-black font-orbitron text-purple-300">{report.overallRank}</p>
                                    </div>
                                    <div className="bg-black/60 border border-indigo-800/40 p-4 rounded-sm">
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">TALENT_DNA</p>
                                        <p className="text-2xl font-black font-orbitron text-indigo-300">{report.talentClass.split(' ')[0]}</p>
                                    </div>
                                    <div className="bg-black/60 border border-amber-800/40 p-4 rounded-sm">
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">OBSESSION_LVL</p>
                                        <p className="text-2xl font-black font-orbitron text-amber-300">{report.obsessionLevel.split(' ')[0]}</p>
                                    </div>
                                    <div className="bg-black/60 border border-cyan-800/40 p-4 rounded-sm">
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">RARITY_IDX</p>
                                        <p className="text-xl font-black font-orbitron text-cyan-300">{report.rarity}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-purple-800/20 pt-8">
                                <h3 className="text-cyan-400 font-black text-[11px] tracking-[0.5em] uppercase mb-4 flex items-center gap-3">
                                    <Database size={18} /> Operational Directive
                                </h3>
                                <div className="bg-black/60 border border-cyan-900/40 p-6 rounded-sm text-[10px] text-gray-300 font-mono leading-relaxed space-y-3">
                                    <p><span className="text-cyan-500 font-black">DEPLOYMENT_RECOMMENDATION:</span> {report.obsessionLevel === 'Compulsive' ? 'Fast-track to advanced protocols—minimal failure risk.' : report.obsessionLevel === 'Relentless' ? 'Suitable for marathon-style long-term objectives.' : report.obsessionLevel === 'Locked-In' ? 'Recommend structured milestones with external accountability.' : 'High early-dropout probability—implement reward loops and weekly visibility.'}</p>
                                    <p><span className="text-cyan-500 font-black">BURNOUT_RISK:</span> {report.obsessionLevel === 'Compulsive' || report.obsessionLevel === 'Relentless' ? 'Negligible to Low' : report.obsessionLevel === 'Locked-In' ? 'Low' : 'High'}</p>
                                    <p><span className="text-cyan-500 font-black">OPTIMAL_PACE:</span> {report.talentClass === 'Genius' ? 'Exponential acceleration—asset handles high complexity bursts.' : report.talentClass === 'Gifted' ? 'Moderate-to-aggressive progression.' : report.talentClass === 'Talented Learner' ? 'Structured progression with specialization focus.' : 'Linear progression with reinforcement cycles.'}</p>
                                </div>
                            </div>

                            <div className="border-t border-purple-800/20 pt-8">
                                <h3 className="text-white font-black text-[11px] tracking-[0.5em] uppercase mb-4 flex items-center gap-3">
                                    <Lock size={18} /> Immutable Profile Elements
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[9px]">
                                    <div className="bg-black/60 border border-gray-800 p-3 rounded-sm flex items-center gap-2">
                                        <Lock size={12} className="text-gray-600" />
                                        <span className="text-gray-400"><span className="text-gray-300 font-black">Talent Class</span> — Locked until promotion</span>
                                    </div>
                                    <div className="bg-black/60 border border-gray-800 p-3 rounded-sm flex items-center gap-2">
                                        <Lock size={12} className="text-gray-600" />
                                        <span className="text-gray-400"><span className="text-gray-300 font-black">HATI %</span> — Percentile frozen</span>
                                    </div>
                                    <div className="bg-black/60 border border-gray-800 p-3 rounded-sm flex items-center gap-2">
                                        <Lock size={12} className="text-gray-600" />
                                        <span className="text-gray-400"><span className="text-gray-300 font-black">Biometrics</span> — Static hardware</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CALL TO ACTION */}
                <div className="transition-all duration-1000 text-center space-y-6 pt-10 pb-20 animate-in slide-in-from-bottom-8 duration-700 delay-700">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-4">
                            <Binary className="text-purple-900" size={24} />
                            <ShieldCheck className="text-purple-500 animate-bounce" size={24} />
                            <Binary className="text-purple-900" size={24} />
                        </div>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[1em] mb-4">Dossier_Classification_Complete</p>
                        <p className="text-[9px] text-gray-700 font-mono italic">All tiers unlocked. Asset profile fully calibrated and ready for deployment.</p>
                    </div>
                    
                    {onProceed && (
                        <button 
                            onClick={onProceed} 
                            className="group relative bg-purple-600 hover:bg-purple-500 text-white font-black py-6 px-20 rounded-sm transition-all duration-500 shadow-[0_0_60px_rgba(168,85,247,0.3)] border border-purple-400/40 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="flex items-center justify-center gap-6 text-2xl font-orbitron tracking-[0.4em] uppercase">
                                <Zap className="group-hover:scale-125 transition-transform" /> 
                                INITIATE_UPGRADE
                            </span>
                        </button>
                    )}
                </div>
            </div>
            
            {clearance < 3 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce opacity-40">
                    <ChevronRight className="rotate-90 text-purple-500" size={32} />
                </div>
            )}
        </div>
    );
};
