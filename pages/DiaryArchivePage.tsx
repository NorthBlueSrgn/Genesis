
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { Search, Calendar, History, BookOpen, ChevronRight, X } from 'lucide-react';

const DiaryArchivePage: React.FC = () => {
    const { gameState, isLoading } = useGameState();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntry, setSelectedEntry] = useState<any>(null);

    const entries = useMemo(() => {
        if (!gameState) return [];
        return [...gameState.journal].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [gameState]);

    const filteredEntries = useMemo(() => {
        return entries.filter(e => 
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [entries, searchTerm]);

    if (isLoading || !gameState) return <Loader text="Accessing Archive Archives..." />;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black font-orbitron uppercase tracking-widest">Diary Archive</h1>
                <p className="hud-text-accent uppercase text-xs mt-2">Chronological Telemetry History</p>
            </div>

            <Card className="!border-purple-500/20 bg-black/40">
                <div className="flex items-center gap-4 p-2">
                    <Search className="text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search past logs..."
                        className="bg-transparent w-full text-white outline-none font-mono text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                    <div 
                        key={entry.id} 
                        onClick={() => setSelectedEntry(entry)}
                        className="hud-card p-6 cursor-pointer hover:border-purple-500 group transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20"><BookOpen size={40} /></div>
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Calendar size={12} /> {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <h3 className="text-xl font-bold font-serif italic text-gray-200 mb-3 truncate group-hover:text-white">"{entry.title}"</h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{entry.content}</p>
                        <div className="mt-4 flex justify-end">
                            <ChevronRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}
                {filteredEntries.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-lg">
                        <History size={48} className="mx-auto text-gray-800 mb-4" />
                        <p className="text-gray-600 font-bold uppercase tracking-widest">No matching telemetry found.</p>
                    </div>
                )}
            </div>

            {selectedEntry && (
                <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 md:p-10">
                    <div className="w-full max-w-3xl bg-[#fdf6e3] border-4 border-black p-8 md:p-12 shadow-[30px_30px_0px_rgba(168,85,247,0.2)] relative">
                        <div className="absolute inset-0 pointer-events-none paper-texture z-0 opacity-30 mix-blend-multiply" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-xs font-black text-purple-600 uppercase tracking-[0.4em] mb-2">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                                    <h2 className="text-4xl font-serif font-black italic text-[#1b2b34]">"{selectedEntry.title}"</h2>
                                </div>
                                <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-black/5 rounded-full"><X size={32} className="text-black"/></button>
                            </div>
                            <div className="prose prose-lg text-[#1b2b34] font-serif leading-relaxed max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar-light">
                                {selectedEntry.content.split('\n').map((para: string, i: number) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>
                            <div className="mt-10 border-t border-black/10 pt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                                <span>Ref_Log: {selectedEntry.id}</span>
                                <span>Project_Genesis_System_Archive</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiaryArchivePage;
