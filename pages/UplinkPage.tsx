import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import { PenLine, History, Search, X, Save, BookOpen, BrainCircuit, Activity, Cpu, ShieldCheck } from 'lucide-react';

const UplinkPage: React.FC = () => {
    const { gameState, isLoading, addJournalEntry } = useGameState();
    const [viewMode, setViewMode] = useState<'editor' | 'archive'>('editor');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntry, setSelectedEntry] = useState<any>(null);
    
    // Editor State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const archiveEntries = useMemo(() => {
        if (!gameState) return [];
        return [...gameState.journal]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .filter(e => 
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                e.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [gameState?.journal, searchTerm]);

    const handleSave = () => {
        if (!content.trim()) return;
        addJournalEntry(title || `NEURAL_LOG_${new Date().toLocaleDateString()}`, content);
        setTitle("");
        setContent("");
        setViewMode('archive');
    };

    if (isLoading || !gameState) return <Loader text="Synchronizing Neural Uplink..." />;

    return (
        <div className="min-h-full space-y-6 max-w-6xl mx-auto p-4 md:p-10 font-mono">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 border-b border-purple-900/30 pb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-purple-500 mb-3 animate-pulse">
                        <Cpu size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">DIRECT_NEURAL_UPLINK_STABLE</span>
                    </div>
                    <h1 className="text-5xl font-black font-orbitron uppercase text-white tracking-widest leading-none">
                        Neural Uplink
                    </h1>
                </div>

                <div className="flex items-center gap-2 bg-gray-800 p-1 border border-purple-900/40">
                    <button 
                        onClick={() => setViewMode('editor')}
                        className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'editor' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-600 hover:text-gray-300'}`}
                    >
                        <PenLine size={14} /> New_Dump
                    </button>
                    <button 
                        onClick={() => setViewMode('archive')}
                        className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'archive' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-gray-600 hover:text-gray-300'}`}
                    >
                        <History size={14} /> Archive
                    </button>
                </div>
            </div>

            {viewMode === 'editor' ? (
                /* EDITOR VIEW - Clinical & Focused */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                    <div className="bg-gray-900/10 border border-purple-900/20 p-10 rounded-sm space-y-10 relative overflow-hidden hud-card">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none rotate-12"><BrainCircuit size={400} /></div>
                        
                        <div className="space-y-4 relative z-10">
                            <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] flex items-center gap-2">
                                <Activity size={12} /> Entry_Subjective_Title
                            </label>
                            <input 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Identify thought frequency..."
                                className="w-full bg-transparent text-4xl font-orbitron font-black text-white outline-none border-b border-purple-900/20 focus:border-purple-500 pb-4 transition-all placeholder:text-gray-800"
                            />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] flex items-center gap-2">
                                <Activity size={12} /> Philosophical_Payload
                            </label>
                            <textarea 
                                autoFocus
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Initialize internal cognitive deconstruction. Document breakthroughs, existential shifts, and strategic internal pivots..."
                                className="w-full bg-transparent text-xl text-gray-400 outline-none resize-none min-h-[450px] leading-relaxed font-mono placeholder:text-gray-800 focus:text-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-green-500/50 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Encryption_Enabled (256-BIT)
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={!content.trim()}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white px-12 py-5 font-black font-orbitron text-xs uppercase tracking-[0.5em] flex items-center gap-4 transition-all shadow-[0_0_30px_rgba(168,85,247,0.2)] rounded-sm border border-purple-400/30"
                        >
                            <Save size={18} /> Commit_To_Void
                        </button>
                    </div>
                </div>
            ) : (
                /* ARCHIVE VIEW - Intelligence Search */
                <div className="animate-in fade-in duration-500 space-y-8">
                    <div className="bg-gray-700 border border-purple-900/30 p-5 flex items-center gap-6 rounded-sm">
                        <Search className="text-purple-600" />
                        <input 
                            type="text" 
                            placeholder="QUERY NEURAL HISTORY DATABANKS..."
                            className="bg-transparent w-full text-white font-mono text-sm outline-none placeholder:text-gray-700 tracking-widest"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {archiveEntries.map((entry) => (
                            <div 
                                key={entry.id} 
                                onClick={() => setSelectedEntry(entry)}
                                className="bg-gray-900/10 p-8 cursor-pointer border border-purple-900/20 hover:border-purple-500/60 transition-all relative overflow-hidden group shadow-2xl hud-card"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-10 transition-opacity"><BookOpen size={60} className="text-white" /></div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[9px] font-black text-purple-400 bg-purple-950/40 px-3 py-1 rounded-sm uppercase tracking-[0.2em] font-mono">
                                        ID: {entry.id.substring(0, 6)}
                                    </span>
                                    <span className="text-[8px] font-black text-gray-600 uppercase font-mono">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-orbitron font-black text-gray-100 mb-4 truncate group-hover:text-purple-400 leading-tight">"{entry.title}"</h3>
                                <p className="text-xs text-gray-500 line-clamp-5 leading-relaxed font-mono opacity-80">{entry.content}</p>
                            </div>
                        ))}
                        {archiveEntries.length === 0 && (
                            <div className="col-span-full py-24 text-center border border-dashed border-purple-900/20 rounded-sm bg-purple-900/5">
                                <History size={64} className="mx-auto text-purple-900/20 mb-6" />
                                <p className="text-purple-900/50 font-black uppercase tracking-[0.6em]">Search_Protocol_Null</p>
                            </div>
                        )}
                    </div>

                    {selectedEntry && (
                        <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl" onClick={() => setSelectedEntry(null)}>
                            <div className="w-full max-w-5xl bg-[#010101] border border-purple-900/60 p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] relative hud-card" onClick={e => e.stopPropagation()}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent" />
                                <div className="relative z-10 space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black text-purple-500 uppercase tracking-[0.5em] font-mono mb-2">{new Date(selectedEntry.date).toLocaleString()}</p>
                                            <h2 className="text-5xl font-orbitron font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{selectedEntry.title}</h2>
                                        </div>
                                        <button onClick={() => setSelectedEntry(null)} className="p-3 hover:bg-white/5 rounded-full text-gray-600 hover:text-white transition-colors"><X size={40}/></button>
                                    </div>
                                    
                                    <div className="text-2xl text-gray-400 font-mono leading-relaxed max-h-[60vh] overflow-y-auto pr-8 custom-scrollbar">
                                        {selectedEntry.content.split('\n').map((para: string, i: number) => (
                                            <p key={i} className="mb-8">{para}</p>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12 border-t border-purple-900/30 pt-8 text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.5em] flex justify-between">
                                        <span>RECOVERY_SIG: {selectedEntry.id}</span>
                                        <span>GENESIS_UPLINK_DATABASE_CORE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="mt-16 flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.6em] text-gray-800">
                <span>NODE_OMEGA</span>
                <span>•</span>
                <span>UPTIME: 99.9%</span>
                <span>•</span>
                <span>ARCHIVE_HEALTH: OPTIMAL</span>
            </div>
        </div>
    );
};

export default UplinkPage;