
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import { ChevronLeft, ChevronRight, ArrowLeft, Save, Edit3, PenLine, History, Search, X, BookOpen, BrainCircuit, Activity, Cpu, ShieldCheck, BookText, Calendar, Clock, FileText, ChevronDown, Archive } from 'lucide-react';
import { JournalEntry } from '../types';

const ArchiveVolume: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-4 border border-purple-900/20 bg-black/20 overflow-hidden rounded-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-4 bg-purple-900/5 hover:bg-purple-900/10 transition-colors border-b border-purple-900/10"
            >
                <div className="flex items-center gap-3">
                    <Archive size={16} className="text-purple-500" />
                    <span className="font-orbitron font-black text-xs text-purple-400 tracking-[0.3em] uppercase">{title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-2 space-y-1">{children}</div>}
        </div>
    );
};

const JournalPage: React.FC = () => {
    const { gameState, isLoading, toggleHistoricalHabit, updateDailyMetrics, setDailyNote, addJournalEntry } = useGameState();
    const [activeTab, setActiveTab] = useState<'ledger' | 'archive'>('ledger');
    
    // Ledger State
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isSnapshotMode, setIsSnapshotMode] = useState(false);
    const [snapshotText, setSnapshotText] = useState("");

    // Archive State
    const [archiveView, setArchiveView] = useState<'editor' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArchiveEntry, setSelectedArchiveEntry] = useState<JournalEntry | null>(null);
    const [archiveTitle, setArchiveTitle] = useState("");
    const [archiveContent, setArchiveContent] = useState("");

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const monthName = viewDate.toLocaleString('default', { month: 'long' }).toUpperCase();
    const year = viewDate.getFullYear();

    const userPillars = useMemo(() => {
        return gameState?.paths.flatMap(p => p.tasks.filter(t => t.isNonNegotiable)) || [];
    }, [gameState?.paths]);

    // Ledger Actions
    const handleDaySelect = (day: number) => {
        const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const existingNote = gameState?.dailyNotes[dateStr] || "";
        setSelectedDay(day);
        setSnapshotText(existingNote);
        setIsSnapshotMode(true);
    };

    const handleSaveSnapshot = () => {
        if (selectedDay === null) return;
        const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        setDailyNote(dateStr, snapshotText);
        setIsSnapshotMode(false);
        setSelectedDay(null);
    };

    const handleCellToggle = (habitId: string, day: number) => {
        const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentStatus = gameState?.habitHistory[dateStr]?.[habitId];
        toggleHistoricalHabit(dateStr, habitId, currentStatus === true ? false : true);
    };

    const handleMetricUpdate = (field: 'sleepHours' | 'weightKg', val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num)) updateDailyMetrics({ [field]: num });
    };

    // Archive Actions
    const handleSaveArchive = () => {
        if (!archiveContent.trim()) return;
        addJournalEntry(archiveTitle || `NEURAL_LOG_${new Date().toLocaleDateString()}`, archiveContent);
        setArchiveTitle("");
        setArchiveContent("");
        setArchiveView('list');
    };

    const groupedEntries = useMemo<Record<string, JournalEntry[]>>(() => {
        if (!gameState) return {};
        const filtered = [...gameState.journal]
            .filter(e => 
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                e.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const groups: Record<string, JournalEntry[]> = {};
        filtered.forEach(entry => {
            const date = new Date(entry.date);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
            if (!groups[key]) groups[key] = [];
            groups[key].push(entry);
        });
        return groups;
    }, [gameState?.journal, searchTerm]);

    const sleepGraphPoints = useMemo(() => {
        return Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const snapshot = gameState?.statHistory.find(h => h.date.startsWith(dateStr));
            const hours = (day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth()) 
                ? gameState?.dailyMetrics.sleepHours 
                : snapshot?.sleepHours || 0;
            
            // Scaled to fit 24px width column
            const x = Math.min(90, Math.max(10, (hours / 12) * 100));
            const y = (i * 30) + 15; 
            return { x, y, hours: hours || 0 };
        });
    }, [gameState, viewDate, year]);

    const svgPath = useMemo(() => {
        const validPoints = sleepGraphPoints.filter(p => p.hours > 0);
        if (validPoints.length < 2) return "";
        return validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }, [sleepGraphPoints]);

    if (isLoading || !gameState) return <Loader text="Decrypting Bandit's Secret..." />;

    const rowHeight = "30px";

    return (
        <div className="min-h-full flex flex-col p-4 md:p-8 font-sans">
            
            {/* UNIFIED HEADER */}
            {!isSnapshotMode && !selectedArchiveEntry && (
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 border-b border-purple-900/30 pb-6 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-purple-500 mb-2">
                            <ShieldCheck size={16} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">BANDIT_PROTOCOL_ENCRYPTED</span>
                        </div>
                        <h1 className="text-5xl font-black font-orbitron uppercase text-white tracking-widest leading-none">
                            Bandit's Secret
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 p-1 border border-purple-900/40 rounded-sm shadow-xl">
                        <button 
                            onClick={() => setActiveTab('ledger')}
                            className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ledger' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <BookText size={14} /> Field_Ledger
                        </button>
                        <button 
                            onClick={() => setActiveTab('archive')}
                            className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'archive' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <History size={14} /> Neural_Archive
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'ledger' ? (
                /* ANALOG FIELD LEDGER */
                <div className="flex flex-col items-center">
                    {!isSnapshotMode ? (
                        <div className="w-full max-w-[1400px] space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-end mb-4 px-2">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-4xl font-permanent font-bold tracking-tighter text-gray-500 leading-none">
                                        {monthName} {year}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 bg-gray-900 hover:bg-gray-800 rounded border border-gray-800 transition-colors"><ChevronLeft size={20} className="text-white"/></button>
                                        <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 bg-gray-900 hover:bg-gray-800 rounded border border-gray-800 transition-colors"><ChevronRight size={20} className="text-white"/></button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase opacity-40 tracking-widest text-white">Presence_Asset_ID</span>
                                    <p className="text-xs font-black uppercase tracking-widest text-purple-400">{gameState.userName}</p>
                                </div>
                            </div>

                            <div className="w-full shadow-[0_30px_100px_rgba(0,0,0,0.7)] relative border border-black/20 rounded-sm overflow-hidden bg-[#fdf6e3] notebook-spread flex min-h-[960px]">
                                <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none z-[60]" />
                                
                                {/* Left Page (Presence Snapshot) - ALL BLACK FONT */}
                                <div className="w-[42%] border-r-2 border-black/10 flex flex-col relative bg-[#fdf6e3]">
                                    <div className="absolute inset-0 ledger-grid-bg opacity-[0.1]" />
                                    <div className="p-8 h-28 border-b border-black/10 flex items-end">
                                        <h2 className="text-2xl font-permanent text-[#1b2b34] leading-none italic uppercase tracking-wider underline decoration-[#1b2b34]/20 underline-offset-8">Memorable Moments</h2>
                                    </div>
                                    <div className="flex-grow">
                                        {Array.from({ length: 31 }).map((_, i) => {
                                            const day = i + 1;
                                            const isGrayed = day > daysInMonth;
                                            const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const note = gameState.dailyNotes[dateStr];

                                            return (
                                                <div 
                                                    key={day} 
                                                    style={{ height: rowHeight }}
                                                    onClick={() => !isGrayed && handleDaySelect(day)}
                                                    className={`flex border-b border-black/[0.05] group transition-colors ${isGrayed ? 'opacity-5 pointer-events-none' : 'hover:bg-black/[0.02] cursor-pointer'}`}
                                                >
                                                    <div className="w-12 flex items-center justify-center border-r border-black/[0.05] text-[10px] font-black font-mono text-[#1b2b34]/40 group-hover:text-[#1b2b34]">{day}</div>
                                                    <div className="flex-grow flex items-center px-4 overflow-hidden gap-3">
                                                        {note ? (
                                                            <>
                                                                <span className="text-[9px] font-black text-[#1b2b34] uppercase font-mono tracking-tighter flex-shrink-0">SIG.LOG</span>
                                                                <span className="text-lg font-nanum text-[#1b2b34] truncate group-hover:underline leading-none">{note}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-[#1b2b34]/20 uppercase italic opacity-0 group-hover:opacity-40 transition-opacity">Grounding_Required</span>
                                                        )}
                                                    </div>
                                                    <div className="pr-4 flex items-center opacity-0 group-hover:opacity-20 text-[#1b2b34]">
                                                        <Edit3 size={12} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Page (Habit Matrix & Sleep) - ALL BLACK FONT */}
                                <div className="flex-grow flex flex-col relative bg-[#fdf6e3]">
                                    <div className="absolute inset-0 ledger-grid-bg opacity-[0.1]" />
                                    
                                    <div className="flex h-28 border-b border-black/10">
                                        <div className="flex flex-grow border-r border-black/10">
                                            <div className="w-10 border-r border-black/10 flex items-center justify-center p-1 bg-black/5">
                                                <span className="text-[8px] font-black uppercase text-center vertical-rl rotate-180 tracking-[0.1em] text-[#1b2b34]">Weight</span>
                                            </div>
                                            {userPillars.map((pillar, idx) => (
                                                <div key={idx} className="flex-grow border-r border-black/10 flex items-center justify-center p-1 overflow-hidden group max-w-[48px]">
                                                    <span className="text-[8px] font-black uppercase text-center vertical-rl rotate-180 tracking-[0.1em] leading-tight text-[#1b2b34]/40 group-hover:text-[#1b2b34]">
                                                        {pillar.description.substring(0, 15)}...
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-24 bg-black/5 flex flex-col items-center justify-center border-l border-black/10">
                                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#1b2b34]/60 mb-1">Sleep</span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#1b2b34]/60">Trend</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow relative">
                                        {/* FIXED SLEEP TREND CONTAINER - PREVENTS OVERFLOW */}
                                        <div className="absolute right-0 top-0 w-24 h-full pointer-events-none z-20 overflow-hidden">
                                            <svg className="w-full h-full" viewBox="0 0 100 930" preserveAspectRatio="none">
                                                <path d={svgPath} fill="none" stroke="#1b2b34" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1,4" className="opacity-40" />
                                                {sleepGraphPoints.map((p, i) => (
                                                    p.hours > 0 && <circle key={i} cx={p.x} cy={p.y} r="5" fill="#1b2b34" stroke="#fdf6e3" strokeWidth="2" className="opacity-80" />
                                                ))}
                                            </svg>
                                        </div>

                                        <div className="flex flex-col">
                                            {Array.from({ length: 31 }).map((_, i) => {
                                                const day = i + 1;
                                                const isGrayed = day > daysInMonth;
                                                const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth();
                                                const dateStr = `${year}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const snapshot = gameState.statHistory.find(h => h.date.startsWith(dateStr));
                                                const currentWeight = isToday ? gameState.dailyMetrics.weightKg : snapshot?.weightKg;
                                                const currentSleep = isToday ? gameState.dailyMetrics.sleepHours : snapshot?.sleepHours;

                                                return (
                                                    <div key={day} style={{ height: rowHeight }} className={`flex border-b border-black/[0.05] ${isGrayed ? 'opacity-5' : ''}`}>
                                                        <div className="flex flex-grow border-r border-black/10">
                                                            <div className="w-10 border-r border-black/[0.08] flex items-center justify-center bg-black/5">
                                                                <input type="number" defaultValue={currentWeight || ''} disabled={!isToday} onBlur={(e) => handleMetricUpdate('weightKg', e.target.value)} className="w-full bg-transparent text-[9px] font-black font-mono text-center outline-none text-[#1b2b34] opacity-40 focus:opacity-100" placeholder="--" />
                                                            </div>
                                                            {userPillars.map((pillar) => {
                                                                const status = gameState.habitHistory[dateStr]?.[pillar.id];
                                                                return (
                                                                    <div key={pillar.id} onClick={() => !isGrayed && handleCellToggle(pillar.id, day)} className="flex-grow border-r border-black/[0.08] flex items-center justify-center cursor-pointer hover:bg-black/[0.02] max-w-[48px]">
                                                                        <div className={`w-5 h-5 flex items-center justify-center font-permanent text-xl transition-all ${status === true ? 'text-[#1b2b34] scale-110 -rotate-6' : 'text-transparent'}`}>X</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="w-24 flex items-center justify-center relative group bg-black/[0.02]">
                                                            <span className={`text-[10px] font-black font-mono text-[#1b2b34] ${currentSleep ? 'opacity-100' : 'opacity-10'}`}>{currentSleep ? `${currentSleep}h` : '--'}</span>
                                                            {isToday && <input type="number" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleMetricUpdate('sleepHours', e.target.value)} />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 bottom-0 left-[42%] w-px bg-black/10 z-[70]" />
                                <div className="absolute top-0 bottom-0 left-[42%] w-12 -ml-6 bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none z-[65]" />
                            </div>
                        </div>
                    ) : (
                        /* SNAPSHOT MODAL-STYLE INPUT (STRICT INK AESTHETIC) */
                        <div className="w-full max-w-2xl bg-[#fdf6e3] shadow-[20px_20px_60px_rgba(0,0,0,1)] border border-black/10 rounded-sm relative overflow-hidden animate-in zoom-in-95 duration-300 min-h-[40vh] flex flex-col">
                            <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none" />
                            <div className="absolute inset-0 ledger-grid-bg opacity-[0.05] pointer-events-none" />
                            <div className="p-8 border-b border-black/10 flex justify-between items-center relative z-10">
                                <button onClick={() => setIsSnapshotMode(false)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1b2b34] hover:underline transition-colors"><ArrowLeft size={16} /> Cancel</button>
                                <div className="text-center">
                                    <span className="text-[10px] font-black uppercase opacity-30 text-[#1b2b34]">Presence_Log</span>
                                    <h2 className="text-4xl font-permanent text-black">DAY {selectedDay}</h2>
                                </div>
                                <button onClick={handleSaveSnapshot} className="bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                                    <Save size={16} /> Commit_Ink
                                </button>
                            </div>
                            <div className="flex-grow p-12 relative z-10 flex flex-col gap-8 justify-center items-center">
                                <label className="text-[10px] font-black uppercase text-[#1b2b34] opacity-40 tracking-[0.5em] mb-4 italic">"Define this cycle in one core event."</label>
                                <textarea autoFocus value={snapshotText} maxLength={140} onChange={e => setSnapshotText(e.target.value)} placeholder="Recorded presence..." className="bg-transparent text-4xl font-permanent text-center text-[#1b2b34] outline-none resize-none placeholder:opacity-10 leading-tight w-full" />
                                <div className="text-[10px] font-mono text-[#1b2b34]/20 uppercase">{snapshotText.length} / 140 Characters</div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* NEURAL ARCHIVE (CLINICAL DIARY / VOLUMES) */
                <div className="animate-in fade-in duration-700 max-w-5xl mx-auto w-full">
                    {archiveView === 'editor' ? (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => setArchiveView('list')} className="text-[10px] font-black text-gray-500 hover:text-white flex items-center gap-2 tracking-widest uppercase"><ArrowLeft size={14} /> Return_To_Volumes</button>
                                <div className="flex items-center gap-3 text-green-500/50 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14} /> Encryption_Active_B256</div>
                            </div>
                            
                            <div className="bg-black/60 border border-purple-900/30 p-10 rounded-sm space-y-12 relative overflow-hidden hud-card">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none rotate-12"><BrainCircuit size={400} /></div>
                                
                                <div className="space-y-4 relative z-10">
                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] flex items-center gap-2"><Activity size={12} /> Log_Frequency_ID</label>
                                    <input value={archiveTitle} onChange={e => setArchiveTitle(e.target.value)} placeholder="Entry designation..." className="w-full bg-transparent text-4xl font-orbitron font-black text-white outline-none border-b border-purple-900/20 focus:border-purple-500 pb-4 transition-all placeholder:text-gray-800" />
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] flex items-center gap-2"><Cpu size={12} /> Narrative_Payload</label>
                                    <textarea autoFocus value={archiveContent} onChange={e => setArchiveContent(e.target.value)} placeholder="Commence deep cognitive recording. Document existential breakthroughs, strategic shifts, or internal friction..." className="w-full bg-transparent text-xl text-gray-400 outline-none resize-none min-h-[450px] leading-relaxed font-mono placeholder:text-gray-900 focus:text-white transition-colors" />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={handleSaveArchive} disabled={!archiveContent.trim()} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-12 py-5 font-black font-orbitron text-xs uppercase tracking-[0.5em] flex items-center gap-4 transition-all shadow-[0_0_30px_rgba(168,85,247,0.2)] rounded-sm border border-purple-400/30"
                                >
                                    <Save size={18} /> COMMIT_TO_VOLUMES
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex-grow flex items-center bg-black/60 border border-purple-900/30 p-3 rounded-sm shadow-inner">
                                    <Search className="text-purple-600 mr-4" size={18} />
                                    <input type="text" placeholder="FILTER_NEURAL_VOLUMES..." className="bg-transparent w-full text-white font-mono text-sm outline-none placeholder:text-gray-700 tracking-widest" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <button onClick={() => setArchiveView('editor')} className="bg-purple-600 text-white px-8 py-3 h-full font-black font-orbitron text-xs uppercase tracking-[0.3em] flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:brightness-110 transition-all rounded-sm"><PenLine size={16} /> New_Dump</button>
                            </div>

                            <div className="space-y-2">
                                {Object.keys(groupedEntries).length > 0 ? (
                                    /* Fix: Explicitly cast the Object.entries result to ensure correct typing of 'entries' for the map method */
                                    (Object.entries(groupedEntries) as [string, JournalEntry[]][]).map(([monthYear, entries]) => (
                                        <ArchiveVolume key={monthYear} title={monthYear}>
                                            <div className="divide-y divide-purple-900/10">
                                                {entries.map(entry => (
                                                    <div 
                                                        key={entry.id} 
                                                        onClick={() => setSelectedArchiveEntry(entry)}
                                                        className="group flex items-center justify-between p-4 hover:bg-purple-600/10 cursor-pointer border border-transparent hover:border-purple-500/20 transition-all"
                                                    >
                                                        <div className="flex items-center gap-6 min-w-0">
                                                            <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-900 border border-gray-800 rounded-sm text-gray-500 group-hover:text-purple-400 group-hover:border-purple-500/40 transition-colors">
                                                                <span className="text-[8px] font-bold uppercase">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                                                                <span className="text-lg font-black font-orbitron">{new Date(entry.date).getDate()}</span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider group-hover:text-white truncate">"{entry.title}"</h3>
                                                                <p className="text-[10px] text-gray-600 font-mono flex items-center gap-2 mt-1">
                                                                    <Clock size={10} /> {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} 
                                                                    <span className="mx-1 opacity-20">•</span> 
                                                                    <span className="truncate">{entry.content.substring(0, 100)}...</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                            <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest font-mono">ID_{entry.id.substring(0, 5)}</span>
                                                            <FileText size={16} className="text-purple-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ArchiveVolume>
                                    ))
                                ) : (
                                    <div className="py-24 text-center border border-dashed border-purple-900/20 rounded-sm bg-purple-900/5">
                                        <History size={64} className="mx-auto text-purple-900/10 mb-6" />
                                        <p className="text-purple-900/40 font-black uppercase tracking-[0.6em]">Search_Protocol_Null</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedArchiveEntry && (
                        <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl" onClick={() => setSelectedArchiveEntry(null)}>
                            <div className="w-full max-w-5xl bg-[#010101] border border-purple-900/60 p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] relative hud-card" onClick={e => e.stopPropagation()}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black text-purple-500 uppercase tracking-[0.5em] font-mono mb-2 flex items-center gap-2">
                                                <Calendar size={12} /> {new Date(selectedArchiveEntry.date).toLocaleString()}
                                            </p>
                                            <h2 className="text-5xl font-orbitron font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{selectedArchiveEntry.title}</h2>
                                        </div>
                                        <button onClick={() => setSelectedArchiveEntry(null)} className="p-3 hover:bg-white/5 rounded-full text-gray-600 hover:text-white transition-colors"><X size={40}/></button>
                                    </div>
                                    
                                    <div className="text-2xl text-gray-400 font-mono leading-relaxed max-h-[60vh] overflow-y-auto pr-8 custom-scrollbar">
                                        {/* Fix: Safely handle null content and split into paragraphs for mapping. */}
                                        {(selectedArchiveEntry?.content || "").split('\n').map((para: string, i: number) => (
                                            <p key={i} className="mb-8">{para}</p>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12 border-t border-purple-900/30 pt-8 text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.5em] flex justify-between">
                                        <span>RECOVERY_SIG: {selectedArchiveEntry.id}</span>
                                        <span>DATABASE_SEC_ALPHA_V5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="mt-16 flex justify-center gap-12 text-[9px] font-black uppercase tracking-[0.6em] text-gray-800">
                <span>NODE_ALPHA_7</span>
                <span>•</span>
                <span>FILE_REF: BANDIT_SECRET_GP55</span>
                <span>•</span>
                <span>FIELD_SYNC: OPTIMAL</span>
            </div>
        </div>
    );
};

export default JournalPage;
