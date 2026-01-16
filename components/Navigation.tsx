
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Swords, BarChart2, Star, MessageSquare, Target, BookText, Book, Calendar, ListTodo, Wrench, BrainCircuit, Award, LayoutDashboard, X, History, PenLine, Cpu, ShieldAlert } from 'lucide-react';

interface NavigationProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/paths', icon: Swords, label: 'Protocols' },
  { to: '/stats', icon: BarChart2, label: 'Biometrics' },
  { to: '/labyrinth', icon: BrainCircuit, label: 'Labyrinth' },
  { to: '/rank', icon: Star, label: 'Grade/Threat' },
  { to: '/achievements', icon: Award, label: 'Archives' },
  { to: '/order', icon: MessageSquare, label: 'Central' },
  { to: '/missions', icon: Target, label: 'Directives' },
  { to: '/planner', icon: Calendar, label: 'Tactical Planner' },
  { to: '/side-missions', icon: ListTodo, label: 'Campaigns' },
  { to: '/focus', icon: BrainCircuit, label: 'Focus_Mode' },
  { to: '/journal', icon: ShieldAlert, label: "Bandit's Secret" },
  { to: '/chapter-black', icon: Book, label: 'Chapter Black' },
  { to: '/settings', icon: Wrench, label: 'System Settings' },
];

const Navigation: React.FC<NavigationProps> = ({ isMobileOpen, onClose }) => {
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-purple-500/10 text-white border-l-2 border-purple-500 shadow-[inset_4px_0_10px_rgba(168,85,247,0.1)]'
        : 'text-gray-500 hover:bg-gray-800/30 hover:text-gray-200 border-l-2 border-transparent'
    }`;

  const navContent = (
    <div className="flex flex-col h-full bg-bg-deep">
        <ul className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4 px-3">Operational_Nodes</div>
            {navItems.slice(0, 11).map(item => (
                <li key={item.to}>
                <NavLink to={item.to} className={navLinkClasses} onClick={onClose}>
                    <item.icon className="w-4 h-4 mr-4 flex-shrink-0" />
                    <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                </NavLink>
                </li>
            ))}
            <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mt-8 mb-4 px-3">Classified_Logs</div>
            {navItems.slice(11).map(item => (
                <li key={item.to}>
                <NavLink to={item.to} className={navLinkClasses} onClick={onClose}>
                    <item.icon className="w-4 h-4 mr-4 flex-shrink-0" />
                    <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                </NavLink>
                </li>
            ))}
        </ul>
        <div className="p-4 border-t border-purple-900/20 text-center bg-black/40">
            <span className="text-[8px] text-purple-900 font-black uppercase tracking-[0.5em]">v5.5_BANDIT_UPLINK</span>
        </div>
    </div>
  );

  return (
    <>
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-bg-deep border-r border-purple-900/20 flex-col z-30 shadow-2xl">
        <div className="flex flex-col items-center justify-center h-24 border-b border-purple-900/20 bg-black/40">
          <span className="text-2xl font-orbitron font-black text-white tracking-[0.3em] uppercase">GENESIS</span>
          <span className="text-[8px] text-purple-500 font-bold tracking-[0.5em] mt-1 uppercase">Stolen_Frequency</span>
        </div>
        {navContent}
      </nav>

      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
        <nav className={`relative h-full w-72 bg-bg-deep border-r border-purple-900/20 flex flex-col transition-transform duration-300 shadow-2xl ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between h-20 border-b border-purple-900/20 px-6">
                 <span className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">GENESIS</span>
                 <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                    <X size={24} />
                 </button>
            </div>
            {navContent}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
