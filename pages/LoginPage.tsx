import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import * as firebaseService from '../services/firebaseService';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import GenesisIcon from '../components/ui/GenesisIcon';
import { Lock, User, Mail, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { login: appLogin } = useGameState();
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Allow login with either username or email
            const success = await appLogin(usernameOrEmail, password);
            if (!success) {
                setError('Authentication failed. Check username/email and password.');
            }
        } catch (e: any) {
            setError(e.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please provide a valid email address (e.g., user@example.com)');
            return;
        }
        
        setIsLoading(true);
        
        try {
            if (!username.trim()) {
                setError('A unique Designation is required for registration.');
                setIsLoading(false);
                return;
            }
            await firebaseService.signUp(email, password, username);
            // Firebase auth state change will handle the rest
        } catch (e: any) {
            setError(e.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loader text="Synchronizing Identity..." />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#010101] p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-film-grain pointer-events-none"></div>
            <div className="absolute inset-0 scanline-overlay pointer-events-none"></div>

            <Card className="w-full max-w-md border-purple-500/30 relative z-10 backdrop-blur-md bg-black/70 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            <GenesisIcon size={56} className="animate-pulse transition-transform duration-700" />
                            <div className="absolute inset-0 bg-cyan-500/10 animate-ping rounded-full scale-50" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-300 to-purple-500 tracking-tighter">GENESIS</h1>
                    <p className="text-purple-500/70 font-mono tracking-[0.5em] text-[9px] mt-3 font-bold uppercase">Authorization Protocol Active</p>
                </div>

                <form onSubmit={isCreating ? handleCreate : handleLogin} className="space-y-6">
                    {isCreating ? (
                        // Registration mode: show email and username fields
                        <>
                            <div>
                                <label className="block text-gray-500 text-[10px] font-bold mb-1.5 uppercase tracking-[0.2em] font-mono">Identity Email</label>
                                <div className="flex items-center bg-gray-700 border border-gray-800 focus-within:border-purple-500 transition-all rounded-sm p-3 group">
                                    <Mail className="text-gray-600 group-focus-within:text-purple-400 transition-colors mr-3" size={18} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className="bg-transparent w-full text-white focus:outline-none font-mono text-sm"
                                        placeholder="name@network.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-500 text-[10px] font-bold mb-1.5 uppercase tracking-[0.2em] font-mono">Public Designation (Username)</label>
                                <div className="flex items-center bg-gray-700 border border-gray-800 focus-within:border-purple-500 transition-all rounded-sm p-3 group">
                                    <User className="text-gray-600 group-focus-within:text-purple-400 transition-colors mr-3" size={18} />
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)} 
                                        className="bg-transparent w-full text-white focus:outline-none font-mono text-sm"
                                        placeholder="operative_codename"
                                        required
                                    />
                                </div>
                                <p className="text-gray-600 text-[9px] mt-1">3-20 characters, letters/numbers/underscore/hyphen only</p>
                            </div>
                        </>
                    ) : (
                        // Login mode: show username/email field
                        <div>
                            <label className="block text-gray-500 text-[10px] font-bold mb-1.5 uppercase tracking-[0.2em] font-mono">Username or Email</label>
                            <div className="flex items-center bg-gray-700 border border-gray-800 focus-within:border-purple-500 transition-all rounded-sm p-3 group">
                                <User className="text-gray-600 group-focus-within:text-purple-400 transition-colors mr-3" size={18} />
                                <input 
                                    type="text" 
                                    value={usernameOrEmail} 
                                    onChange={e => setUsernameOrEmail(e.target.value)} 
                                    className="bg-transparent w-full text-white focus:outline-none font-mono text-sm"
                                    placeholder="operative_codename or email@network.com"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-gray-500 text-[10px] font-bold mb-1.5 uppercase tracking-[0.2em] font-mono">Encrypted Access Key</label>
                        <div className="flex items-center bg-gray-700 border border-gray-800 focus-within:border-purple-500 transition-all rounded-sm p-3 group">
                            <Lock className="text-gray-600 group-focus-within:text-purple-400 transition-colors mr-3" size={18} />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="bg-transparent w-full text-white focus:outline-none font-mono text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/10 border border-red-500/40 p-3 rounded-sm flex items-center gap-3 animate-pulse">
                            <Shield className="text-red-500" size={16} />
                            <p className="text-red-400 text-[10px] font-mono font-bold uppercase leading-tight">{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.97] text-white font-black py-4 rounded-sm transition-all font-orbitron tracking-[0.3em] text-sm shadow-[0_10px_20px_rgba(168,85,247,0.2)] border border-purple-400/20"
                    >
                        {isCreating ? 'INITIALIZE_ASSET' : 'UNLOCK_SESSION'}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-800/50 text-center">
                    <button 
                        onClick={() => { setIsCreating(!isCreating); setError(''); }} 
                        className="text-gray-500 hover:text-purple-300 text-[10px] font-mono font-bold flex items-center justify-center gap-3 mx-auto transition-all group tracking-widest"
                    >
                        {isCreating ? (
                            <>ALREADY_ACTIVE? LOG_IN</>
                        ) : (
                            <>NEW_ASSET_DETECTED? REGISTER</>
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
