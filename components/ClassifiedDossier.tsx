// components/ClassifiedDossier.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FullCalibrationReport, TalentDna, TalentClass, ObsessionLevel, AttributeRankName, ResonanceType } from '../types';
import { Fingerprint, ShieldAlert, Zap, TrendingUp, BrainCircuit, Target, AlertTriangle, History, Activity, Database, Cpu, Search, Lock, UserCheck, ShieldCheck, ChevronRight, Binary, Signal, AlertOctagon, Star, Award, Shield, ArrowUpRight, BarChart3, Heart, Zap as ZapIcon, Brain, Sparkles, Radio, Eye, Crosshair } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ScatterChart, Scatter } from 'recharts';

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

// Psychometric Profile Card
const PsychometricProfile: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
    const getMbtiDescription = (mbti: string) => {
        const descriptions: Record<string, string> = {
            'ISTJ': 'The Logistician',
            'ISFJ': 'The Defender',
            'INFJ': 'The Advocate',
            'INTJ': 'The Architect',
            'ISTP': 'The Virtuoso',
            'ISFP': 'The Adventurer',
            'INFP': 'The Mediator',
            'INTP': 'The Logician',
            'ESTP': 'The Entrepreneur',
            'ESFP': 'The Entertainer',
            'ENFP': 'The Campaigner',
            'ENTP': 'The Debater',
            'ESTJ': 'The Executive',
            'ESFJ': 'The Consul',
            'ENFJ': 'The Protagonist',
            'ENTJ': 'The Commander',
        };
        return descriptions[mbti] || 'Unknown Archetype';
    };

    const mbtiProfile = report.mbtiProfile?.split(':')[0] || 'UNK';
    const archetypeName = getMbtiDescription(mbtiProfile);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/60 border border-purple-900/60 p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                <h3 className="text-purple-400 font-black text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                    <Brain size={14} /> MBTI Classification
                </h3>
                <p className="text-3xl font-black font-orbitron text-purple-300 mb-1">{mbtiProfile}</p>
                <p className="text-[11px] text-purple-200 font-mono italic">{archetypeName}</p>
                <div className="mt-4 pt-4 border-t border-purple-900/30 text-[8px] text-gray-500 space-y-1 font-mono">
                    <p className="text-purple-400"><span className="font-black">E/I:</span> {mbtiProfile.charAt(0)}</p>
                    <p className="text-purple-400"><span className="font-black">S/N:</span> {mbtiProfile.charAt(1)}</p>
                    <p className="text-purple-400"><span className="font-black">T/F:</span> {mbtiProfile.charAt(2)}</p>
                    <p className="text-purple-400"><span className="font-black">J/P:</span> {mbtiProfile.charAt(3)}</p>
                </div>
            </div>

            <div className="bg-black/60 border border-cyan-900/60 p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                <h3 className="text-cyan-400 font-black text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> Symbolic Alias
                </h3>
                <p className="text-2xl font-black font-orbitron text-cyan-300 mb-2 uppercase">{report.symbolicProfile || 'CIPHER_UNKNOWN'}</p>
                <div className="bg-cyan-950/20 p-3 border border-cyan-900/40 rounded-sm">
                    <p className="text-[9px] text-cyan-300 font-mono italic leading-relaxed">
                        Archetypal resonance mapping. Symbolic profile encodes behavioral predisposition and psychological sovereignty framework.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Anomaly Matrix with scatter plot
const AnomalyMatrix: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
    // Generate scatter data for anomaly distribution (Tk vs Ok)
    const anomalyData = [
        { tk: report.traitScores.LE || 50, ok: report.traitScores.IP || 50, label: 'User Position', fill: '#a855f7' },
        { tk: 65, ok: 60, label: 'Norm Cluster', fill: '#666' },
        { tk: 45, ok: 70, label: 'Outlier A', fill: '#f97316', opacity: 0.3 },
        { tk: 75, ok: 45, label: 'Outlier B', fill: '#f97316', opacity: 0.3 },
        { tk: 80, ok: 80, label: 'Singularity', fill: '#fbbf24', opacity: 0.2 },
    ];

    return (
        <div className="bg-black/60 border border-red-900/60 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
            <h3 className="text-red-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <Crosshair size={14} /> Anomaly Matrix (Tk vs Ok)
            </h3>
            <div className="h-[280px] bg-black/40 border border-red-900/30 rounded-sm relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3,3" stroke="#333" opacity={0.3} />
                        <XAxis type="number" dataKey="tk" domain={[0, 100]} stroke="#666" label={{ value: 'Tk (Technical Knowledge)', position: 'bottom', fill: '#999', fontSize: 10 }} />
                        <YAxis type="number" dataKey="ok" domain={[0, 100]} stroke="#666" label={{ value: 'Ok (Operational Kinetics)', angle: -90, position: 'insideLeft', fill: '#999', fontSize: 10 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #a855f7', borderRadius: '2px' }}
                            labelStyle={{ color: '#a855f7' }}
                            cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
                        />
                        <Scatter name="Anomalies" data={anomalyData} fill="#a855f7" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[8px]">
                <div className="bg-black/40 border border-red-900/30 p-2 rounded-sm"><span className="text-red-400 font-black">Tk:</span> <span className="text-gray-400">Technical Knowledge intensity</span></div>
                <div className="bg-black/40 border border-red-900/30 p-2 rounded-sm"><span className="text-red-400 font-black">Ok:</span> <span className="text-gray-400">Operational Kinetics manifestation</span></div>
                <div className="bg-black/40 border border-red-900/30 p-2 rounded-sm"><span className="text-red-400 font-black">Quadrant:</span> <span className="text-gray-400">Position indicates anomaly type</span></div>
                <div className="bg-black/40 border border-red-900/30 p-2 rounded-sm"><span className="text-red-400 font-black">Ghost Nodes:</span> <span className="text-gray-400">Historical outlier echoes (dim)</span></div>
            </div>
        </div>
    );
};

// Biometric Vectors
const BiometricVectors: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
    // Use hati field if available, otherwise fallback to percentile calculation
    const hatiValue = report.hati !== undefined ? report.hati : (report.percentile || 0) * 0.95;
    const hatiIndex = Number(hatiValue.toFixed(1)); // Show one decimal place
    const ceilingRank = report.estimatedCeilingRank || 'A';
    const talentDnaScore = Math.round((report.talentDna?.BP || 0.5) * 100);
    const baselineAdjusted = report.baselineAdjusted || false;

    // Determine HATI rank
    const getHATIRank = (hati: number): string => {
        if (hati >= 99.9) return 'SS+';
        if (hati >= 97) return 'SS';
        if (hati >= 90) return 'S';
        if (hati >= 75) return 'A';
        if (hati >= 60) return 'B';
        if (hati >= 40) return 'C';
        if (hati >= 20) return 'D';
        return 'E';
    };

    const hatiRank = getHATIRank(hatiIndex);
    const rankColor = hatiRank === 'SS+' || hatiRank === 'SS' ? 'text-cyan-300' :
                      hatiRank === 'S' ? 'text-amber-300' :
                      hatiRank === 'A' ? 'text-indigo-300' :
                      hatiRank === 'B' ? 'text-purple-300' :
                      hatiRank === 'C' ? 'text-blue-300' :
                      'text-green-300';

    // Calculate next rank thresholds and progress
    const rankThresholds = { E: 0, D: 20, C: 40, B: 60, A: 75, S: 90, SS: 97, 'SS+': 99.9 };
    const currentThreshold = rankThresholds[hatiRank as keyof typeof rankThresholds];
    const nextRankName = hatiRank === 'SS+' ? null :
                        hatiRank === 'SS' ? 'SS+' :
                        hatiRank === 'S' ? 'SS' :
                        hatiRank === 'A' ? 'S' :
                        hatiRank === 'B' ? 'A' :
                        hatiRank === 'C' ? 'B' :
                        hatiRank === 'D' ? 'C' : 'D';
    const nextThreshold = nextRankName ? rankThresholds[nextRankName as keyof typeof rankThresholds] : 100;
    const progressPercent = nextRankName 
        ? ((hatiIndex - currentThreshold) / (nextThreshold - currentThreshold)) * 100 
        : 100;

    return (
        <div className="bg-black/60 border border-green-900/60 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
            <h3 className="text-green-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <Activity size={14} /> Biometric Vectors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/50 border border-green-900/40 p-4 rounded-sm">
                    <div className="text-[9px] text-gray-500 font-mono mb-2 uppercase tracking-tighter">HATI Index</div>
                    <div className={`text-3xl font-black font-orbitron ${rankColor} mb-2 flex items-center gap-2`}>
                        {hatiIndex}%
                        <span className="text-sm font-normal">{hatiRank}</span>
                    </div>
                    <div className="text-[8px] text-gray-600 font-mono mb-2">Human Apex Threat Index</div>
                    
                    {/* HATI Progress Bar to Next Rank */}
                    {nextRankName && (
                        <div className="mt-3 pt-3 border-t border-green-900/30">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[8px] text-gray-500 font-mono uppercase">Progress to {nextRankName}</span>
                                <span className="text-[8px] text-green-400 font-black font-mono">{progressPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                                <div 
                                    className={`h-full transition-all duration-1000 ${
                                        nextRankName === 'SS+' ? 'bg-gradient-to-r from-cyan-500 to-purple-500' :
                                        nextRankName === 'SS' ? 'bg-cyan-500' :
                                        nextRankName === 'S' ? 'bg-amber-500' :
                                        nextRankName === 'A' ? 'bg-indigo-500' :
                                        nextRankName === 'B' ? 'bg-purple-500' :
                                        nextRankName === 'C' ? 'bg-blue-500' :
                                        'bg-green-500'
                                    } shadow-[0_0_10px_currentColor]`}
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[7px] text-gray-600 font-mono mt-1">
                                <span>{hatiRank} ({currentThreshold}%)</span>
                                <span>{nextRankName} ({nextThreshold}%)</span>
                            </div>
                        </div>
                    )}
                    
                    {baselineAdjusted && (
                        <div className="mt-2 pt-2 border-t border-green-900/30">
                            <div className="text-[8px] text-green-400 font-mono italic">
                                ⚡ B-Rank Baseline Active
                            </div>
                            <div className="text-[7px] text-gray-500 font-mono">
                                Starting as Elite Hunter
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-black/50 border border-green-900/40 p-4 rounded-sm">
                    <div className="text-[9px] text-gray-500 font-mono mb-2 uppercase tracking-tighter">Ceiling Rank</div>
                    <div className="text-3xl font-black font-orbitron text-green-300 mb-2">{ceilingRank}</div>
                    <div className="text-[8px] text-gray-600 font-mono">Estimated maximum achievable rank</div>
                </div>
                <div className="bg-black/50 border border-green-900/40 p-4 rounded-sm">
                    <div className="text-[9px] text-gray-500 font-mono mb-2 uppercase tracking-tighter">Talent DNA Score</div>
                    <div className="text-3xl font-black font-orbitron text-green-300 mb-2">{talentDnaScore}%</div>
                    <div className="text-[8px] text-gray-600 font-mono">Base potential coefficient</div>
                </div>
            </div>
        </div>
    );
};

// Risk Assessment Panel
const RiskAssessment: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
    const failureNodeRisk = String((report as any)?.failureNodeRisk || '');
    const failureRiskLevel = failureNodeRisk.includes('Critical') ? 'CRITICAL' : 
                             failureNodeRisk.includes('High') ? 'HIGH' : 'MODERATE';
    const failureColor = failureRiskLevel === 'CRITICAL' ? 'text-red-500' : failureRiskLevel === 'HIGH' ? 'text-orange-500' : 'text-yellow-500';
    const failureBg = failureRiskLevel === 'CRITICAL' ? 'bg-red-950/20 border-red-900/40' : 
                      failureRiskLevel === 'HIGH' ? 'bg-orange-950/20 border-orange-900/40' : 'bg-yellow-950/20 border-yellow-900/40';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${failureBg} border p-6 relative overflow-hidden rounded-sm`}>
                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                <h3 className={`${failureColor} font-black text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2`}>
                    <AlertTriangle size={14} /> Failure Node
                </h3>
                <p className={`${failureColor} font-black text-lg font-orbitron mb-3 uppercase`}>{report.primaryFailureNode}</p>
                <div className="bg-black/60 p-3 border border-gray-800 rounded-sm">
                    <p className={`${failureColor} text-[9px] font-mono italic`}>Trigger: {failureNodeRisk || 'N/A'}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[9px]">
                    <div className={`w-3 h-3 rounded-full ${failureRiskLevel === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-gray-400">Risk Level: <span className={`${failureColor} font-black`}>{failureRiskLevel}</span></span>
                </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/40 p-6 relative overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
                <h3 className="text-blue-400 font-black text-[10px] tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
                    <Eye size={14} /> Success Probability
                </h3>
                <div className="text-4xl font-black font-orbitron text-blue-300 mb-4">{report.successProbability}%</div>
                <div className="h-2 bg-black/60 border border-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: `${report.successProbability}%`}} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[8px]">
                    <div className="text-gray-400">Success: <span className="text-blue-400 font-black">{report.successProbability}%</span></div>
                    <div className="text-gray-400">Dropout: <span className="text-red-400 font-black">{report.dropoutProbability}%</span></div>
                </div>
            </div>
        </div>
    );
};

// Resonance Signature
const ResonanceSignature: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
    const getResonanceProfile = () => {
        // Map rarity band to resonance type
        const rarityToResonance: Record<string, ResonanceType> = {
            'Singularity': ResonanceType.Juggernaut,
            'Outlier': ResonanceType.Catalyst,
            'Abnormality': ResonanceType.Virtuoso,
            'Exceptional': ResonanceType.Chameleon,
            'Optimized': ResonanceType.Cipher,
        };
        return rarityToResonance[report.rarityBand] || ResonanceType.Unawakened;
    };

    const resonanceType = getResonanceProfile();
    const resonanceDescriptions: Record<ResonanceType, { ability: string; aura: string }> = {
        [ResonanceType.Juggernaut]: { ability: 'Unstoppable Momentum', aura: 'Crushing pressure—relentless forward motion' },
        [ResonanceType.Catalyst]: { ability: 'Activation Protocol', aura: 'Spark that ignites change in systems' },
        [ResonanceType.Virtuoso]: { ability: 'Precision Mastery', aura: 'Effortless control and technical transcendence' },
        [ResonanceType.Chameleon]: { ability: 'Adaptive Evolution', aura: 'Seamless metamorphosis across domains' },
        [ResonanceType.Cipher]: { ability: 'Invisible Architect', aura: 'Hidden shaper of outcomes' },
        [ResonanceType.Joker]: { ability: 'Chaos Weaver', aura: 'Unpredictable breakthrough potential' },
        [ResonanceType.Unawakened]: { ability: 'Dormant Potential', aura: 'Calibrating...' },
    };

    const profile = resonanceDescriptions[resonanceType];

    return (
        <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-900/60 p-6 relative overflow-hidden rounded-sm">
            <div className="absolute inset-0 bg-film-grain !opacity-[0.03]" />
            <div className="absolute top-2 right-2 opacity-10"><Radio size={40} className="text-purple-500" /></div>
            <h3 className="text-purple-400 font-black text-[10px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <Radio size={14} /> Resonance Signature
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="text-[9px] text-gray-500 font-mono mb-1 uppercase tracking-tighter">Type</div>
                    <div className="text-2xl font-black font-orbitron text-purple-300 uppercase mb-4">{resonanceType}</div>
                    <div className="text-[9px] text-gray-500 font-mono mb-1 uppercase tracking-tighter">Tier</div>
                    <div className="text-lg font-black font-orbitron text-purple-400">{report.rarityBand}</div>
                </div>
                <div className="bg-black/50 border border-purple-900/40 p-4 rounded-sm">
                    <div className="text-[9px] text-purple-400 font-black mb-2 uppercase tracking-tighter">Ability</div>
                    <p className="text-[11px] font-black font-orbitron text-purple-200 mb-3">{profile.ability}</p>
                    <div className="text-[9px] text-purple-400 font-black mb-1 uppercase tracking-tighter">Aura</div>
                    <p className="text-[10px] text-purple-300 font-mono italic">{profile.aura}</p>
                </div>
            </div>
        </div>
    );
};

// Singularity Plot: Clean grid showing Talent (Y) vs Obsession (X)
const SingularityPlot: React.FC<{ talentClass: TalentClass; obsessionLevel: ObsessionLevel }> = ({ talentClass, obsessionLevel }) => {
    const talentMap: Record<TalentClass, { y: number; label: string }> = {
        'Laggard': { y: 20, label: 'LAGGARD' },
        'Average': { y: 40, label: 'AVERAGE' },
        'Talented Learner': { y: 60, label: 'TALENTED' },
        'Gifted': { y: 80, label: 'GIFTED' },
        'Genius': { y: 95, label: 'GENIUS' }
    };

    const obsessionMap: Record<ObsessionLevel, { x: number; label: string }> = {
        'Lazy': { x: 20, label: 'LAZY' },
        'Average': { x: 40, label: 'AVERAGE' },
        'Locked-In': { x: 60, label: 'LOCKED-IN' },
        'Relentless': { x: 80, label: 'RELENTLESS' },
        'Compulsive': { x: 95, label: 'COMPULSIVE' }
    };

    const userX = obsessionMap[obsessionLevel]?.x || 50;
    const userY = talentMap[talentClass]?.y || 50;

    return (
        <div className="relative w-full h-[350px] bg-black border border-gray-800 rounded-sm overflow-hidden">
            <svg viewBox="0 0 500 350" className="w-full h-full">
                <defs>
                    <linearGradient id="topRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="topLeft" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid background */}
                {[50, 100, 150, 200, 250, 300, 350, 400, 450].map(x => (
                    <line key={`v${x}`} x1={x} y1="30" x2={x} y2="330" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                ))}
                {[50, 100, 150, 200, 250, 300].map(y => (
                    <line key={`h${y}`} x1="50" y1={30 + y} x2="450" y2={30 + y} stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                ))}

                {/* Quadrant backgrounds */}
                <rect x="250" y="30" width="200" height="150" fill="url(#topRight)" />
                <rect x="50" y="180" width="200" height="150" fill="url(#topLeft)" />

                {/* Axis lines */}
                <line x1="50" y1="30" x2="50" y2="330" stroke="#666" strokeWidth="2" />
                <line x1="50" y1="330" x2="450" y2="330" stroke="#666" strokeWidth="2" />

                {/* Axis labels */}
                <text x="240" y="25" fontSize="12" fontWeight="900" fill="#999" textAnchor="middle">TALENT CLASS</text>
                <text x="25" y="180" fontSize="12" fontWeight="900" fill="#999" textAnchor="middle" transform="rotate(-90 25 180)">OBSESSION LEVEL</text>

                {/* Y-axis labels (Talent) */}
                {Object.entries(talentMap).map(([key, val]) => (
                    <g key={key}>
                        <line x1="45" y1={30 + (300 - val.y * 3)} x2="50" y2={30 + (300 - val.y * 3)} stroke="#666" strokeWidth="2" />
                        <text x="35" y={30 + (300 - val.y * 3) + 4} fontSize="10" fontWeight="bold" fill="#aaa" textAnchor="end">{val.label}</text>
                    </g>
                ))}

                {/* X-axis labels (Obsession) */}
                {Object.entries(obsessionMap).map(([key, val]) => (
                    <g key={key}>
                        <line x1={50 + val.x * 4} y1="330" x2={50 + val.x * 4} y2="335" stroke="#666" strokeWidth="2" />
                        <text x={50 + val.x * 4} y="350" fontSize="10" fontWeight="bold" fill="#aaa" textAnchor="middle">{val.label}</text>
                    </g>
                ))}

                {/* User position marker */}
                <circle cx={50 + userX * 4} cy={30 + (300 - userY * 3)} r="8" fill="none" stroke="#a855f7" strokeWidth="2" />
                <circle cx={50 + userX * 4} cy={30 + (300 - userY * 3)} r="4" fill="#a855f7" />
                <text x={50 + userX * 4} y={30 + (300 - userY * 3) - 15} fontSize="11" fontWeight="900" fill="#a855f7" textAnchor="middle">YOU</text>

                {/* Reference points */}
                {[
                    { x: 95, y: 95, label: 'SINGULARITY', color: '#fbbf24' },
                    { x: 20, y: 20, label: 'STAGNANT', color: '#ef4444' },
                    { x: 95, y: 20, label: 'UNDISCIPLINED', color: '#f97316' }
                ].map((ref, i) => (
                    <g key={i} opacity="0.4">
                        <rect x={50 + ref.x * 4 - 3} y={30 + (300 - ref.y * 3) - 3} width="6" height="6" fill={ref.color} />
                        <text x={50 + ref.x * 4} y={30 + (300 - ref.y * 3) - 12} fontSize="8" fontWeight="bold" fill={ref.color} textAnchor="middle">{ref.label}</text>
                    </g>
                ))}

                {/* Labels for quadrants */}
                <text x="350" y="60" fontSize="11" fontWeight="900" fill="#10b98144" textAnchor="middle">HIGH PERFORMER</text>
                <text x="150" y="280" fontSize="11" fontWeight="900" fill="#8b5cf644" textAnchor="middle">EFFORT HERO</text>
            </svg>
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
            className="relative w-screen h-screen flex flex-col bg-[#010101] text-gray-300 font-mono overflow-y-auto overflow-x-hidden vignette transition-all duration-1000"
        >
            <div className="bg-film-grain !opacity-15 pointer-events-none z-[100] fixed inset-0" />
            <div className="absolute inset-0 pointer-events-none scanline-overlay z-40 fixed" />
            <div className="grid-background absolute inset-0 pointer-events-none fixed" />

            <header className="flex-shrink-0 border-b border-purple-900/30 bg-black/95 p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-red-600 text-[10px] font-black tracking-[0.4em] animate-pulse">
                            <ShieldAlert size={14} /> SECURITY_CLEARANCE: LVL_9
                        </div>
                        <h1 className="text-2xl font-black font-orbitron text-gray-100 tracking-[0.2em] uppercase chromatic-aberration">
                            ASSET_FILE: <span className="text-purple-600">GP-0{report.tpi}</span>
                        </h1>
                        <div className="flex gap-6 mt-2 text-[9px] text-gray-500 font-mono tracking-tighter flex-wrap">
                            <span>OPERATIVE: <span className="text-cyan-400 font-bold">{userName.toUpperCase()}</span></span>
                            <span>CODENAME: <span className="text-purple-400 font-bold">{report.codename.toUpperCase()}</span></span>
                            {report.biometrics?.dateOfBirth && <span>DOB: <span className="text-amber-400 font-bold">{report.biometrics.dateOfBirth}</span></span>}
                            {report.biometrics?.age && <span>AGE: <span className="text-yellow-500 font-bold">{report.biometrics.age}</span></span>}
                            {report.biometrics?.gender && <span>GENDER: <span className="text-green-400 font-bold">{report.biometrics.gender}</span></span>}
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

            <div className="relative z-10 flex flex-col w-full overflow-visible custom-scrollbar p-4 md:p-10 max-w-6xl mx-auto space-y-12 pb-32">
                
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
                            <h3 className="text-2xl font-black font-orbitron text-white tracking-widest uppercase">{report.talentClass}</h3>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[8px] font-black border border-purple-500/50 px-2 py-0.5 text-purple-400 uppercase tracking-tighter">{report.rarityBand}</span>
                                <span className="text-[8px] font-black border border-cyan-500/50 px-2 py-0.5 text-cyan-400 uppercase tracking-tighter">MBTI: {report.mbtiProfile ? report.mbtiProfile.split(':')[0] : 'UNK'}</span>
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
                                <div className="text-[8px] text-gray-600 font-bold uppercase italic mt-1 tracking-tighter">Growth_Multiplier: x{(report.talentDna?.LV ? (1 + report.talentDna.LV).toFixed(1) : '1.0')}</div>
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

                {/* SECTION 2: PSYCHOMETRIC PROFILE */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-4 border-l-4 border-purple-600 pl-4">
                        <span className="bg-purple-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02A</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Psychometric Profile</h2>
                    </div>
                    <PsychometricProfile report={report} />
                </section>

                {/* SECTION 3: ANOMALY MATRIX */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-4 border-l-4 border-red-600 pl-4">
                        <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02B</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Anomaly Matrix & Quadrant Mapping</h2>
                    </div>
                    <AnomalyMatrix report={report} />
                </section>

                {/* SECTION 4: BIOMETRIC VECTORS */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-4 border-l-4 border-green-600 pl-4">
                        <span className="bg-green-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02C</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Biometric Vectors</h2>
                    </div>
                    <BiometricVectors report={report} />
                </section>

                {/* SECTION 5: RISK ASSESSMENT */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-4 border-l-4 border-orange-600 pl-4">
                        <span className="bg-orange-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02D</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Risk Assessment</h2>
                    </div>
                    <RiskAssessment report={report} />
                </section>

                {/* SECTION 6: RESONANCE SIGNATURE */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center gap-4 border-l-4 border-pink-600 pl-4">
                        <span className="bg-pink-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_02E</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Resonance Signature</h2>
                    </div>
                    <ResonanceSignature report={report} />
                </section>

                {/* SECTION 2: NEURAL ARCHITECTURE & COMPARATIVE MAPPING */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="flex items-center gap-4 border-l-4 border-cyan-600 pl-4">
                        <span className="bg-cyan-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_03</span>
                        <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Neural architecture mapping</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                             <div className="mb-4 flex flex-col gap-1">
                                <h3 className="text-[10px] text-white font-black bg-purple-900/60 px-3 py-1.5 flex items-center gap-2 w-fit rounded-sm"><TrendingUp size={12} /> TALENT VS OBSESSION MATRIX</h3>
                                <span className="text-[8px] text-gray-500 font-mono italic tracking-tighter">Your position in the learning velocity / psychological adherence space</span>
                             </div>
                             <SingularityPlot 
                                talentClass={report.talentClass} 
                                obsessionLevel={report.obsessionLevel}
                             />
                        </div>
                        <div className="lg:col-span-4 bg-black/60 border border-gray-800 p-6 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-film-grain !opacity-[0.04]" />
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 text-center">Performance Profile Index</h3>
                            <div className="flex-grow">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={[
                                        { name: 'Potential', value: Math.round((report.talentDna?.BP || 0.5) * 100), fill: '#a855f7' },
                                        { name: 'Velocity', value: Math.round((report.talentDna?.LV || 0.5) * 100), fill: '#06b6d4' },
                                        { name: 'Drive', value: Math.round((report.talentDna?.DR || 0.5) * 100), fill: '#f97316' }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3,3" stroke="#333" />
                                        <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#666', fontSize: 9 }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {[
                                                { name: 'Potential', value: Math.round((report.talentDna?.BP || 0.5) * 100), fill: '#a855f7' },
                                                { name: 'Velocity', value: Math.round((report.talentDna?.LV || 0.5) * 100), fill: '#06b6d4' },
                                                { name: 'Drive', value: Math.round((report.talentDna?.DR || 0.5) * 100), fill: '#f97316' }
                                            ].map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-800 text-[8px] text-gray-500 space-y-1">
                                <p><span className="text-purple-400 font-black">Potential:</span> Base talent ceiling</p>
                                <p><span className="text-cyan-400 font-black">Velocity:</span> Learning speed</p>
                                <p><span className="text-orange-400 font-black">Drive:</span> Psychological adherence</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: SYSTEM WARNINGS & STRATEGIC INSIGHT */}
                <section className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex items-center gap-4 border-l-4 border-red-600 pl-4">
                        <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_04</span>
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
                                <div className="w-16 h-16 bg-cyan-950/50 border-2 border-cyan-600 flex items-center justify-center text-cyan-400 font-orbitron font-black text-2xl shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                    {report.historicalPrecedent?.name ? report.historicalPrecedent.name.charAt(0).toUpperCase() : 'X'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black font-orbitron text-white uppercase tracking-wider leading-tight">
                                        {report.historicalPrecedent?.name || 'UNIDENTIFIED_ARCHETYPE'}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold mt-2 uppercase tracking-tighter">
                                        <Signal size={12} /> CONFIDENCE: {report.historicalPrecedent?.matchPercentage || 0}%
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-3 italic leading-tight max-w-xs">"{report.historicalPrecedent?.alignment || 'Profile analysis incomplete'}"</p>
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
                            dangerouslySetInnerHTML={{ __html: (report.centralInsight || 'Profile analysis complete.')
                                .replace(/\*\*(.*?)\*\*/g, '<span class="text-purple-400 font-black tracking-tighter px-1 bg-purple-950/20">$1</span>')
                                .replace(/\*(.*?)\*/g, '<i class="text-cyan-400">$1</i>') }}
                        />
                    </div>
                </section>

                {/* SECTION 4: GROWTH VECTORS & POTENTIAL */}
                <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-400">
                    <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4">
                        <span className="bg-indigo-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_05</span>
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
                        <span className="bg-yellow-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_06</span>
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
                        <span className="bg-white text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_07</span>
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
