
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
import { performTraitAnalysis, calculateCeilingRank, mapScoreToRank, calculateTalentDistribution, getPercentileForSubstat, calculateInitialResonanceVector, convertPercentileToSubstatValue, calculateScores, generateCodename, getPercentileForMetric, calculateSubstatsFromAllTests } from '../services/scoringService';
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
    const TOTAL_TARGETS = 16;

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
            const accuracy = (TOTAL_TARGETS / (TOTAL_TARGETS + misses)) * 100;
            const score = Math.max(0, (TOTAL_TARGETS / totalTime) * 10 * (accuracy / 100));
            onComplete({ avgReactionMs: (totalTime * 1000) / TOTAL_TARGETS, accuracy, score });
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
    }, [targets, misses, testStartTime, onComplete]);

    const handleTargetClick = (e: React.MouseEvent) => { 
        e.stopPropagation(); 
        setTargets(t => t + 1); 
        setActiveTarget(null); 
    };

    const handleMiss = () => { 
        if (activeTarget) setMisses(m => m + 1); 
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
    const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    const colorValues = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-400'];
    const [round, setRound] = useState(1);
    const [current, setCurrent] = useState({ text: '', colorIdx: 0 });
    const [score, setScore] = useState(0);
    const TOTAL_ROUNDS = 15;
    const nextRound = useCallback(() => {
        if (round > TOTAL_ROUNDS) { onComplete({ stroopScore: score }); return; }
        const textIdx = Math.floor(Math.random() * 4);
        const colorIdx = Math.floor(Math.random() * 4);
        setCurrent({ text: colors[textIdx], colorIdx });
    }, [round, score, onComplete]);
    useEffect(() => { nextRound(); }, [round]);
    const handleAnswer = (idx: number) => { if (idx === current.colorIdx) setScore(s => s + 1); setRound(r => r + 1); };
    return (
        <TerminalShell title="Inhibitory Control // Stroop Protocol">
            <div className="flex flex-col items-center flex-grow justify-center py-4">
                <div className={`text-6xl font-black font-orbitron mb-16 tracking-widest ${colorValues[current.colorIdx]}`}>{current.text}</div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    {colors.map((c, i) => (<button key={c} onClick={() => handleAnswer(i)} className="bg-black border border-gray-800 p-4 rounded-sm hover:border-white font-black font-orbitron tracking-widest transition-all">{c}</button>))}
                </div>
            </div>
        </TerminalShell>
    );
};

const DilemmaScreening: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
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
    useEffect(() => { if (idx < baseDilemmas.length) setShuffledOptions(shuffleArray(baseDilemmas[idx].options)); }, [idx]);
    const handleSelect = (code: string) => {
        const newAnswers = [...answers, code];
        if (idx >= baseDilemmas.length - 1) onComplete({ spiritDilemmas: newAnswers });
        else { setAnswers(newAnswers); setIdx(idx + 1); }
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
    // Adaptive reasoning question bank with varying difficulty
    const reasoningQuestions: Record<number, any[]> = {
        20: [ // Very Easy (20%)
            { text: "2 + 2 = ?", options: ["3", "4", "5", "6"], correct: 1 },
            { text: "Which is bigger: 10 or 5?", options: ["5", "10", "Same", "Cannot tell"], correct: 1 },
            { text: "If I have 3 apples and give away 1, how many do I have left?", options: ["1", "2", "3", "4"], correct: 1 },
        ],
        35: [ // Easy
            { text: "If all cats are animals, and Fluffy is a cat, then Fluffy is an...?", options: ["Plant", "Animal", "Rock", "Color"], correct: 1 },
            { text: "A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.10", "$0.05", "$0.15", "$0.20"], correct: 1 },
            { text: "If the day after tomorrow is Thursday, what day is today?", options: ["Monday", "Tuesday", "Wednesday", "Friday"], correct: 1 },
        ],
        50: [ // Medium
            { text: "In a room of 23 people, what is the approximate probability that at least two share a birthday?", options: ["About 10%", "About 25%", "About 50%", "About 75%"], correct: 2 },
            { text: "If all Zorps are Blips, and some Blips are Clonks, what must be true?", options: ["All Zorps are Clonks", "Some Zorps might be Clonks", "No Zorps are Clonks", "Cannot determine"], correct: 1 },
            { text: "A train leaves at 60 mph. Another leaves 2 hours later at 90 mph. When does it catch up?", options: ["3 hours", "4 hours", "5 hours", "6 hours"], correct: 1 },
        ],
        65: [ // Hard
            { text: "Three boxes: apples, oranges, both. All labels are WRONG. You draw an apple from the 'both' box. What's in the 'oranges' box?", options: ["Oranges", "Apples", "Both", "Cannot determine"], correct: 1 },
            { text: "If A=1, B=2, C=3... Z=26, what is LOGIC?", options: ["62", "70", "78", "86"], correct: 1 },
            { text: "A room has 3 switches outside and 1 light inside. You can flip switches but can only enter once. How do you know which switch controls the light?", options: ["Use heat from bulbs", "Check voltage", "Guess randomly", "Use timer and touch bulb"], correct: 0 },
        ],
        80: [ // Very Hard
            { text: "If p=.5 and q=.3 and they're independent, what's P(p AND q)?", options: ["0.8", "0.65", "0.15", "0.08"], correct: 2 },
            { text: "How many squares can you find in a 4x4 grid? (including all sizes)", options: ["16", "30", "40", "64"], correct: 1 },
            { text: "A person born in 1900 and died in 1950 lived how many days?", options: ["18,250", "18,262", "18,263", "18,275"], correct: 2 },
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
        const usedQuestions = currHist.map(h => h.q);
        
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
        
        setCurrentQ(q);
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
                // Final score based on final difficulty (higher = smarter)
                const finalScore = difficulty;
                onComplete({ reasoningScore: finalScore, history: newHistory, finalDifficulty: difficulty });
            } else {
                // Adaptive difficulty adjustment
                const step = Math.max(3, 25 / (round + 0.5));
                const nextDiff = isCorrect 
                    ? Math.max(15, difficulty - step)  // Correct = harder questions
                    : Math.min(85, difficulty + step); // Wrong = easier questions
                
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
    const [responses, setResponses] = useState<Record<string, string>>({});
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

    // Timer management & focus growth
    useEffect(() => {
        if (phase === 'active' && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        handlePromptComplete();
                        return 0;
                    }
                    // Continuous growth check: reward for sustained typing
                    const timeSinceLastInput = Date.now() - lastInputRef.current;
                    if (timeSinceLastInput < 8000 && response.length > 0) {
                        // User has typed within last 8 seconds - tree is growing!
                        setFocusGrowth(prev => Math.min(100, prev + 0.5));
                        setTotalFocusScore(prev => prev + 0.5);
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
        // Bonus growth for rapid typing
        if (text.length > 0) {
            setFocusGrowth(prev => Math.min(100, prev + 0.8));
            setTotalFocusScore(prev => prev + 0.8);
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
        
        // Calculate focus bonus for this prompt
        const focusBonus = focusStreak ? 1.2 : 1.0; // 20% bonus if no interruptions
        const wordCount = getWordCount(response);
        const depthScore = Math.min(wordCount / 50, 1) * 20; // Up to 20 points for depth
        const promptScore = depthScore * focusBonus;
        
        // Save response for this prompt
        const newResponses = { ...responses, [currentPrompt.id]: response.trim() };
        setResponses(newResponses);
        
        if (isLastPrompt) {
            // All prompts complete - show harvest screen
            setPhase('complete');
            setTimeout(() => {
                const finalScore = Math.round(totalFocusScore * 1.5); // Scale to reasonable range
                onComplete({ 
                    creativityResponse: newResponses,
                    focusMetrics: {
                        totalFocusScore: finalScore,
                        interruptions: focusInterruptions,
                        focusStreakBonus: focusStreak ? true : false
                    }
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
            <div className="flex flex-col items-center justify-center text-center flex-grow py-8 space-y-6">
                <Wand2 className="w-16 h-16 text-amber-500 animate-pulse" />
                <h2 className="text-2xl font-black font-orbitron text-amber-400 uppercase tracking-[0.2em]">CREATIVITY CALIBRATION</h2>
                
                <div className="text-sm font-mono text-amber-400 font-bold">
                    PROMPT {currentPromptIndex + 1} / {totalPrompts}
                </div>
                
                <div className="bg-gray-900/40 p-6 border border-amber-900/30 rounded-sm max-w-2xl text-left space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-amber-400 font-bold font-orbitron uppercase tracking-widest text-base">
                            {currentPrompt.substat}
                        </h3>
                        <p className="text-gray-300 italic text-sm">{currentPrompt.definition}</p>
                    </div>
                    
                    <div className="bg-black/40 border border-gray-700 p-4 rounded">
                        <p className="text-white font-serif text-base leading-relaxed">
                            {currentPrompt.prompt}
                        </p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                        <p className="text-[9px] text-gray-500 italic">
                            You have 90 seconds per prompt. Be honest and thoughtful.
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={handleStart} 
                    className="w-full max-w-xs bg-amber-600 hover:bg-amber-500 text-black font-black font-orbitron py-5 rounded-sm tracking-[0.3em] uppercase text-sm transition-all"
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
        // targetDifficulty matches the population percentage directly now
        const targetDifficulty = currDiff;
        
        const q = getAdaptiveQuestionV2(targetDifficulty, usedQuestions);
        
        if (q) {
            setCurrentQ(q);
            setCorrectAnswer(q.acceptedAnswers[0]);
        } else {
            // Fallback question
            setCurrentQ({
                questionText: "What planet do we live on?",
                acceptedAnswers: ["Earth"],
                domain: "Science",
                difficulty: 99
            });
            setCorrectAnswer("Earth");
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
            ? Math.max(5, difficulty - step)  // Correct = harder questions (lower % would know)
            : Math.min(95, difficulty + step); // Wrong = easier questions (higher % would know)
        
        setTimeout(() => {
            if (round >= TOTAL_ROUNDS) {
                // Final score is inverse of difficulty (higher difficulty = lower % = smarter)
                const finalScore = 100 - difficulty;
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

const ChessStrategyTest: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
    // Chess puzzle positions with strategic concepts
    const puzzles = [
        {
            id: 1,
            title: "TACTICAL PURSUIT",
            fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            difficulty: 30,
            bestMove: "Nxe5",
            explanation: "Knight captures with tempo, forking queen. Win material through tactical alertness.",
            strategicConcept: "Recognize when opponent pieces are overloaded with defense."
        },
        {
            id: 2,
            title: "POSITIONAL SACRIFICE",
            fen: "r1bqk2r/pp2nppp/2np1n2/3p4/2BPP3/2N1BP2/PPP3PP/R2QK2R w KQkq - 0 1",
            difficulty: 50,
            bestMove: "Bxf7+",
            explanation: "Sacrifice bishop to rupture kingside defenses. Converts material for decisive attack.",
            strategicConcept: "Trade material for positional advantage when the initiative justifies it."
        },
        {
            id: 3,
            title: "PROPHYLACTIC DEFENSE",
            fen: "r2qkbnr/ppp2ppp/2np4/3Pp3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            difficulty: 40,
            bestMove: "Nc3",
            explanation: "Solidify center, prevent black's counterplay. Play with long-term vision.",
            strategicConcept: "Foresight: block opponent's plans before they develop."
        },
        {
            id: 4,
            title: "ENDGAME PRECISION",
            fen: "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
            difficulty: 35,
            bestMove: "c4",
            explanation: "Advance passed pawn methodically. Convert advantage without overextension.",
            strategicConcept: "Efficiency: advance slowly but surely when winning is certain."
        },
        {
            id: 5,
            title: "DYNAMIC BALANCE",
            fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP1BPPP/RNBQK2R w KQkq - 0 1",
            difficulty: 45,
            bestMove: "dxe5",
            explanation: "Capture center while maintaining balance. Control key squares.",
            strategicConcept: "Balance: take calculated risks when position supports aggression."
        }
    ];

    const [phase, setPhase] = useState<'briefing' | 'puzzle' | 'reflection' | 'complete'>('briefing');
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [userMove, setUserMove] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [reflectionText, setReflectionText] = useState('');
    const [showReflection, setShowReflection] = useState(false);

    const currentPuzzle = puzzles[puzzleIndex];
    const progress = ((puzzleIndex + 1) / puzzles.length) * 100;

    const handleStart = () => setPhase('puzzle');

    const validateMove = () => {
        const normalized = userMove.toUpperCase().replace(/[\s-]/g, '');
        const expectedMove = currentPuzzle.bestMove.toUpperCase().replace(/[\s-]/g, '');
        const isValid = normalized.includes(expectedMove) || expectedMove.includes(normalized);

        setIsCorrect(isValid);
        if (isValid) {
            const score = 100 - (currentPuzzle.difficulty / 100) * 30;
            setTotalScore(prev => prev + score);
            setFeedback(`✓ Correct! ${currentPuzzle.explanation}`);
        } else {
            setFeedback(`✗ Not quite. The best move is ${currentPuzzle.bestMove}. ${currentPuzzle.explanation}`);
        }
        setShowReflection(true);
    };

    const handleReflectionSubmit = () => {
        const newHistory = [...history, {
            puzzleId: currentPuzzle.id,
            title: currentPuzzle.title,
            userMove,
            correct: isCorrect,
            reflection: reflectionText.trim(),
            concept: currentPuzzle.strategicConcept
        }];
        setHistory(newHistory);

        if (puzzleIndex >= puzzles.length - 1) {
            setPhase('complete');
            setTimeout(() => {
                onComplete({
                    strategyScore: Math.round((totalScore / (puzzles.length * 100)) * 100),
                    puzzleHistory: newHistory,
                    totalScore: Math.round(totalScore)
                });
            }, 1500);
        } else {
            setPuzzleIndex(prev => prev + 1);
            setUserMove('');
            setFeedback(null);
            setIsCorrect(null);
            setReflectionText('');
            setShowReflection(false);
            setPhase('puzzle');
        }
    };

    if (phase === 'briefing') return (
        <TerminalShell title="Tactical Engine // Strategy Matrix" accentClass="border-green-900/50">
            <div className="flex flex-col items-center justify-center text-center flex-grow py-12 space-y-8">
                <div className="text-5xl">♔</div>
                <h2 className="text-2xl font-black font-orbitron text-green-400 uppercase tracking-[0.2em]">CHESS STRATEGY CALIBRATION</h2>
                <div className="bg-gray-900/40 p-6 border border-green-900/30 rounded-sm max-w-2xl text-left space-y-4">
                    <p className="text-gray-300 text-sm"><span className="text-green-400 font-bold">Protocol:</span> 5 tactical puzzles testing calculation depth, positional understanding, and strategic vision.</p>
                    <p className="text-gray-400 text-xs italic">For each puzzle: identify the best move, then reflect on the strategic principle it demonstrates.</p>
                    <ul className="text-gray-500 text-xs space-y-1 pl-4 list-disc">
                        <li><span className="text-green-400">Foresight:</span> How many moves ahead can you calculate?</li>
                        <li><span className="text-green-400">Efficiency:</span> Do you find optimal moves or settle for adequate?</li>
                        <li><span className="text-green-400">Balance:</span> Can you weigh risk vs. safety, material vs. position?</li>
                    </ul>
                </div>
                <button onClick={handleStart} className="btn-primary w-full max-w-xs font-orbitron tracking-[0.3em] py-5 uppercase text-sm bg-green-600 hover:bg-green-500">BEGIN CALIBRATION</button>
            </div>
        </TerminalShell>
    );

    if (phase === 'complete') return (
        <TerminalShell title="Tactical Engine // Complete" accentClass="border-green-900/50">
            <div className="flex flex-col items-center justify-center flex-grow py-12 space-y-4">
                <Check className="w-16 h-16 text-green-500" />
                <h2 className="text-xl font-black font-orbitron text-green-400 uppercase tracking-widest">STRATEGY ASSESSMENT COMPLETE</h2>
                <p className="text-gray-500 font-mono text-xs">Analyzing your tactical depth and strategic philosophy...</p>
            </div>
        </TerminalShell>
    );

    return (
        <TerminalShell title={`Tactical Engine // Puzzle ${puzzleIndex + 1}/${puzzles.length}`} accentClass="border-green-900/50">
            <div className="flex flex-col h-full gap-4">
                {/* Progress */}
                <div className="w-full bg-gray-900 h-1 rounded-full relative">
                    <div className="bg-green-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#22c55e]" style={{ width: `${progress}%` }} />
                </div>

                {/* Puzzle Title & Strategy Concept */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4">
                    <h3 className="text-green-400 font-orbitron uppercase tracking-widest text-sm font-bold mb-2">{currentPuzzle.title}</h3>
                    <p className="text-gray-400 text-xs italic">Strategic Concept: {currentPuzzle.strategicConcept}</p>
                </div>

                {/* Chess Board Placeholder */}
                <div className="bg-black border border-gray-700 p-4 rounded-sm flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                        <div className="text-gray-500 text-xs font-mono mb-2">FEN: {currentPuzzle.fen}</div>
                        <div className="text-gray-600 text-sm italic">Chess position analysis required</div>
                        <div className="text-gray-700 text-xs mt-2">(Puzzle difficulty: {currentPuzzle.difficulty}/100)</div>
                    </div>
                </div>

                {/* Move Input */}
                {!showReflection ? (
                    <div className="space-y-3">
                        <label className="block text-xs text-gray-500 uppercase tracking-widest font-bold">Enter your best move:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userMove}
                                onChange={(e) => setUserMove(e.target.value)}
                                placeholder="e.g., Nxe5, Bf4, O-O"
                                className="flex-grow bg-black border border-gray-700 rounded-sm p-3 text-white font-mono focus:border-green-500 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && validateMove()}
                            />
                            <button onClick={validateMove} disabled={!userMove.trim()} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-orbitron text-xs uppercase tracking-widest transition-all disabled:opacity-30">SUBMIT</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Feedback */}
                        <div className={`p-3 rounded-sm text-sm ${isCorrect ? 'bg-green-900/30 border border-green-600 text-green-300' : 'bg-red-900/30 border border-red-600 text-red-300'}`}>
                            {feedback}
                        </div>

                        {/* Reflection Prompt */}
                        <div className="space-y-2">
                            <label className="block text-xs text-gray-500 uppercase tracking-widest font-bold">Reflect on this position:</label>
                            <textarea
                                value={reflectionText}
                                onChange={(e) => setReflectionText(e.target.value)}
                                placeholder="What strategic principle does this move demonstrate? How would you apply this in future positions?"
                                className="w-full bg-black border border-gray-700 rounded-sm p-3 text-white font-mono text-xs resize-none min-h-[80px] focus:border-green-500 outline-none"
                            />
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleReflectionSubmit}
                            className="w-full bg-green-600 hover:bg-green-500 text-black font-orbitron py-3 tracking-widest uppercase text-xs transition-all"
                        >
                            {puzzleIndex === puzzles.length - 1 ? 'COMPLETE' : 'NEXT PUZZLE'}
                        </button>
                    </div>
                )}
            </div>
        </TerminalShell>
    );
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

    const handleFinish = () => onComplete({ maxLevel: level });

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
                            <button 
                                onClick={handleFinish} 
                                className="btn-primary w-full font-orbitron tracking-widest uppercase py-3"
                            >
                                SUBMIT RESULTS
                            </button>
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

    const handleStepComplete = (data: any) => {
        const step = CALIBRATION_BENCHMARKS[stepIndex];
        const newInputs = { ...allInputs, [step.id]: data };
        setAllInputs(newInputs);
        if (stepIndex < CALIBRATION_BENCHMARKS.length - 1) setStepIndex(stepIndex + 1);
        else finalizeOnboarding(newInputs);
    };

    const handleSkipOnboarding = async () => {
        setShowSkipConfirm(false);
        setIsFinalizing(true);
        try {
            // Create minimal default report with baseline stats
            const defaultStats = INITIAL_STATS.map(s => ({
                ...s,
                value: 5000,
                rank: AttributeRankName.C,
                lastIncreased: new Date().toISOString(),
                subStats: (STAT_SUBSTAT_MAP[s.name as StatName] || []).map(ssName => ({
                    name: ssName,
                    value: 1000,
                    rank: AttributeRankName.C,
                    lastIncreased: new Date().toISOString()
                }))
            }));

            const defaultReport: FullCalibrationReport = {
                talentClass: 'Average',
                obsessionLevel: 'Average',
                archetypeTitle: 'UNALIGNED_ASSET',
                rarity: 'Optimized',
                traitScores: { IP: 50, LE: 50, RE: 50, FO: 50, EX: 50, CO: 50 },
                codename: gameState?.userName?.toUpperCase() || 'ASSET',
                mbtiProfile: 'INTJ',
                symbolicProfile: 'Contemplative',
                threatLevel: 'Baseline',
                foreshadowing: 'Growth potential unassessed.',
                ceilingRarity: 'Optimized',
                deviation: 'Standard',
                notes: 'Skipped detailed onboarding calibration.',
                resonanceStability: 'Neutral',
                centralInsight: 'Initial state achieved.',
                rarityBand: 'Optimized',
                candidateTitles: [],
                tpi: 50,
                percentile: 50,
                overallRank: AttributeRankName.C,
                initialStatsSnapshot: defaultStats,
                estimatedCeilingRank: AttributeRankName.B,
                talentDna: { BP: 0.5, LV: 0.5, DR: 0.5 },
                primaryFailureNode: 'Unknown',
                failureNodeRisk: 'Unassessed',
                successProbability: 0.5,
                dropoutProbability: 0.1,
                historicalPrecedent: { name: 'Baseline Human', matchPercentage: 50, alignment: 'Neutral' },
                biometricModifiers: [],
                noteworthyFeats: []
            };

            setReport(defaultReport);
        } catch (error) {
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
                    const { calculateHATI } = require('../data/creativityAssessmentFinal');
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

            // Import interpolate function from services
            const { interpolate } = require('../services/scoringService');

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
            if ((equilibrium as any).score >= 92) feats.push({ label: 'SYSTEM_EQUILIBRIUM', value: 'S-TIER', rarity: 'Elite', desc: 'Maintained systemic sync under complex ripple feedback.' });

            const fullReport = await generateFullCalibrationReport({
                metrics, traits: traitResult, narrative: inputs['narrative-prompt']?.['narrative-prompt'] || "",
                mbtType: inputs['mbti-assessment']?.mbtiResult || "INTJ", codename, biometrics: inputs['biometric-data']
            });

            const finalReport: FullCalibrationReport = {
                ...fullReport, ...traitResult, tpi: calculateScores(stats).apexThreatIndex,
                percentile: calculateScores(stats).apexThreatIndex, overallRank: mapScoreToRank(calculateScores(stats).apexThreatIndex),
                initialStatsSnapshot: stats, estimatedCeilingRank: calculateCeilingRank(mapScoreToRank(calculateScores(stats).apexThreatIndex), traitResult.talentClass),
                // Removed 'rankSnapshots' which is not defined in FullCalibrationReport interface
                talentDna: calculateTalentDistribution(metrics, inputs).dna, noteworthyFeats: feats
            };
            setReport(finalReport);
        } catch (error) { addToast("Calibration error. Simulation Engaged.", "error"); }
        finally { setIsFinalizing(false); }
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
                        <h2 className="text-lg font-orbitron font-bold text-purple-400 uppercase">SKIP CALIBRATION?</h2>
                        <p className="text-sm text-gray-300">Skipping will assign baseline statistics. You can refine your profile later through gameplay.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSkipConfirm(false)}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-orbitron uppercase text-xs transition-all rounded-sm"
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleSkipOnboarding}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-orbitron uppercase text-xs transition-all rounded-sm"
                            >
                                Skip
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
                {step.id === 'high-stakes-war-room' && <ChessStrategyTest onComplete={handleStepComplete} />}
                {step.type === 'dilemma-screening' && <DilemmaScreening onComplete={handleStepComplete} />}
                {step.type === 'creative-protocol-test' && <CreativeProtocolTest onComplete={handleStepComplete} />}
            </div>
        </div>
    );
};
