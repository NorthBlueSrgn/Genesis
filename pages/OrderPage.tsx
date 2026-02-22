import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { sendOrderMessage } from '../services/aiProxy';
import { Chat } from '@google/genai';
import { ChatMessage, Path, Task, TaskType, IconName, SubStatName, AttributeRankName } from '../types';
import Loader from '../components/ui/Loader';
import { Send, Plus, Trash2, ArrowLeft, MessageSquare, Zap, Settings, Archive } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

// Helper: Ensure task mix is 1-2 Daily + 1-2 Weekly (total 3-4)
// Intelligently preserve AI-designated weekly tasks and respect their targetCounts
const ensureTaskMix = (tasks: any[]): any[] => {
  if (!tasks || tasks.length === 0) return tasks;
  
  const dailies = tasks.filter(t => t.type !== 'Weekly');
  const weeklies = tasks.filter(t => t.type === 'Weekly');
  
  console.log(`[ensureTaskMix] Input: ${dailies.length} daily, ${weeklies.length} weekly, total ${dailies.length + weeklies.length}`);
  console.log(`[ensureTaskMix] Weekly tasks:`, weeklies.map(w => ({ description: w.description, targetCount: w.targetCount })));
  
  // Preserve AI-designated weeklies EXACTLY as they are (respecting targetCount)
  let result: any[] = weeklies.map(w => ({
    ...w,
    // Only set targetCount if AI didn't specify one, default to 2
    targetCount: w.targetCount && w.targetCount >= 1 && w.targetCount <= 6 ? w.targetCount : 2
  }));
  
  console.log(`[ensureTaskMix] Preserved weeklies with targetCounts:`, result.map(w => ({ description: w.description, targetCount: w.targetCount })));
  
  // If too many weeklies, keep only 2
  if (result.length > 2) {
    console.log(`[ensureTaskMix] Too many weeklies (${result.length}), keeping only 2`);
    result = result.slice(0, 2);
  }
  
  // Case 1: No weeklies - designate some dailies as weekly to ensure mix
  if (result.length === 0) {
    console.log(`[ensureTaskMix] No weeklies found, need to convert some dailies`);
    if (dailies.length >= 2) {
      // Take the last daily task and convert to weekly
      const taskToConvert = dailies.pop();
      if (taskToConvert) {
        taskToConvert.type = 'Weekly';
        taskToConvert.targetCount = 2; // default
        result.push(taskToConvert);
        console.log(`[ensureTaskMix] Converted to weekly:`, taskToConvert.description);
      }
    }
  }
  
  // Case 2: Only 1 weekly - might need another weekly depending on daily count
  if (result.length === 1 && dailies.length >= 3) {
    console.log(`[ensureTaskMix] Only 1 weekly and 3+ dailies, converting 1 more daily to weekly`);
    const taskToConvert = dailies.pop();
    if (taskToConvert) {
      taskToConvert.type = 'Weekly';
      taskToConvert.targetCount = 2; // default
      result.push(taskToConvert);
      console.log(`[ensureTaskMix] Converted to weekly:`, taskToConvert.description);
    }
  }
  
  // Now add dailies with proper constraints
  // Valid mixes: 1 Daily + 1 Weekly, 1 Daily + 2 Weekly, 2 Daily + 1 Weekly, 2 Daily + 2 Weekly
  const weeklyCount = result.length;
  const maxDailies = weeklyCount === 1 ? 2 : weeklyCount === 2 ? 2 : 2; // 2 max either way
  const minDailies = Math.max(1, 4 - weeklyCount); // at least 1, but ensure total is 3-4
  
  // Take between minDailies and maxDailies from the dailies pool
  const dailiesCount = Math.max(minDailies, Math.min(maxDailies, dailies.length));
  result.push(...dailies.slice(0, dailiesCount));
  
  const finalDailyCount = result.filter(t => t.type !== 'Weekly').length;
  const finalWeeklyCount = result.filter(t => t.type === 'Weekly').length;
  const totalTasks = finalDailyCount + finalWeeklyCount;
  
  console.log(`[ensureTaskMix] Output: ${finalDailyCount} daily, ${finalWeeklyCount} weekly, total ${totalTasks}`);
  
  // Ensure we have valid totals (3-4 tasks with both types)
  if (totalTasks < 3 || totalTasks > 4 || finalDailyCount === 0 || finalWeeklyCount === 0) {
    console.warn(`[ensureTaskMix] Invalid final mix (${finalDailyCount} daily, ${finalWeeklyCount} weekly). This should have been caught.`);
  }
  
  return result;
};

const OrderPage: React.FC = () => {
  const { gameState, dispatch, startNewChat, addMessageToChat, deleteChat, addToast } = useGameState();
  const location = useLocation();
  const prefillMessage = location.state?.prefill;

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [showChatView, setShowChatView] = useState(false);

  const activeSession = useMemo(() => {
    if (!gameState || !activeSessionId) return null;
    return gameState.chatSessions.find(s => s.id === activeSessionId);
  }, [gameState, activeSessionId]);

  useEffect(() => {
    if (gameState && gameState.chatSessions.length > 0 && !activeSessionId) {
      setActiveSessionId(gameState.chatSessions[0].id);
    } else if (gameState && gameState.chatSessions.length === 0) {
      setActiveSessionId(null);
    }
  }, [gameState?.chatSessions]);

  useEffect(() => {
    if (prefillMessage) {
      setUserInput(prefillMessage);
    }
  }, [prefillMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);
  
  useEffect(() => {
      if (activeSessionId && window.innerWidth < 768) {
          setShowChatView(true);
      }
      if (!activeSessionId) {
          setShowChatView(false);
      }
  }, [activeSessionId]);

  const handleNewChat = async () => {
    const sessionId = await startNewChat("Initialize.");
    setActiveSessionId(sessionId);
    addMessageToChat(sessionId, { role: 'model', content: 'Initializing...' });
    if (window.innerWidth < 768) {
      setShowChatView(true);
    }
  };

  const handleDeleteChatAndGoBack = (sessionId: string) => {
    deleteChat(sessionId);
    if (activeSessionId === sessionId) {
        const remainingSessions = gameState?.chatSessions.filter(s => s.id !== sessionId);
        if (remainingSessions && remainingSessions.length > 0) {
            setActiveSessionId(remainingSessions[0].id);
        } else {
            setActiveSessionId(null);
            setShowChatView(false);
        }
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !gameState || !activeSessionId) return;

    const messageToSend = userInput;
    setUserInput('');
    setIsLoading(true);

    addMessageToChat(activeSessionId, { role: 'user', content: messageToSend });

    try {
      const history = activeSession?.messages || [];

      const result = await sendOrderMessage({
        userName: gameState.userName,
        rankName: gameState.rank.name,
        history: history.map(m => ({ role: m.role as any, content: m.content })),
        message: messageToSend,
      });

      const aiResponse = result.text ?? '';

      // Parse for structured commands
      const createProtocolMatch = aiResponse.match(/<GENESIS_CREATE_PROTOCOL>([\s\S]*?)<\/GENESIS_CREATE_PROTOCOL>/);
      const createPathMatch = aiResponse.match(/<GENESIS_CREATE_PATH>([\s\S]*?)<\/GENESIS_CREATE_PATH>/);
      const evolvePathMatch = aiResponse.match(/<GENESIS_EVOLVE_PROTOCOL>([\s\S]*?)<\/GENESIS_EVOLVE_PROTOCOL>/);
      const updateTasksMatch = aiResponse.match(/<GENESIS_UPDATE_TASKS>([\s\S]*?)<\/GENESIS_UPDATE_TASKS>/);
      const deleteProtocolMatch = aiResponse.match(/<GENESIS_DELETE_PROTOCOL>([\s\S]*?)<\/GENESIS_DELETE_PROTOCOL>/);

      let commandExecuted = false;

      // Handle protocol creation (new format from Alfred)
      if (createProtocolMatch?.[1]) {
        try {
          const protocolData = JSON.parse(createProtocolMatch[1]);
          const { name, description, tasks } = protocolData;

          if (name && description && Array.isArray(tasks) && tasks.length > 0) {
            // Ensure proper task mix (2-3 daily + 1-2 weekly)
            const fixedTasks = ensureTaskMix(tasks);
            
            // Transform protocol tasks to Path format
            const pathData: Path = {
              id: `path-${Date.now()}`,
              name: name,
              description: description,
              icon: 'Zap' as IconName,
              tier: 1,
              level: 1,
              xp: 0,
              xpToNextLevel: 100,
              tasks: fixedTasks.map((task: any, idx: number) => {
                const isWeekly = task.type === 'Weekly';
                const targetCount = isWeekly ? (task.targetCount || 2) : undefined;
                return {
                  id: `task-${idx}`,
                  description: task.description,
                  type: isWeekly ? TaskType.Weekly : TaskType.Daily,
                  targetCount: targetCount,
                  currentCount: isWeekly ? 0 : undefined,
                  statBoost: {
                    stat: task.stat || 'Physical',
                    subStat: task.subStat || 'Strength',
                    amount: task.amount || 10
                  },
                  xp: task.xp || 50,
                  isCompleted: false,
                  lastCompleted: undefined
                };
              })
            };

            dispatch({ type: 'ADD_PATH', payload: pathData });
            addMessageToChat(activeSessionId, { role: 'model', content: `Your protocol, "${name}", has been established and is now available in the Protocols interface.` });
            commandExecuted = true;
          } else {
            throw new Error("Incomplete protocol data from Central.");
          }
        } catch (error) {
          console.error('Error parsing GENESIS_CREATE_PROTOCOL:', error);
          addMessageToChat(activeSessionId, { role: 'model', content: 'I do apologize. The protocol data appears to have been corrupted in transmission. Shall we make another attempt?' });
          commandExecuted = true;
        }
      } else if (createPathMatch?.[1]) {
        try {
          let pathData = JSON.parse(createPathMatch[1]) as Path;
          
          // --- CLIENT-SIDE VALIDATION ---
          let isValid = true;
          if (!pathData.tasks || pathData.tasks.length === 0) {
              isValid = false;
          } else {
              for (const task of pathData.tasks) {
                  if (!task.statBoost || !task.statBoost.stat || !task.statBoost.subStat || typeof task.statBoost.amount !== 'number' || task.statBoost.amount <= 0) {
                      isValid = false;
                      console.error("Invalid task from AI:", task);
                      break;
                  }
              }
          }

          if (isValid) {
              // Ensure weekly tasks have proper targetCount and currentCount
              pathData.tasks = pathData.tasks.map(task => {
                  if (task.type === TaskType.Weekly) {
                      return {
                          ...task,
                          targetCount: task.targetCount || 2,
                          currentCount: task.currentCount || 0
                      };
                  }
                  return task;
              });
              
              dispatch({ type: 'ADD_PATH', payload: pathData });
              addMessageToChat(activeSessionId, { role: 'model', content: `Protocol "${pathData.name}" has been established. It is now available in your Protocols interface.` });
              commandExecuted = true;
          } else {
              throw new Error("AI generated an invalid protocol. Please try again.");
          }
        } catch (error) {
          console.error('Error parsing GENESIS_CREATE_PATH:', error);
          addMessageToChat(activeSessionId, { role: 'model', content: 'System Error: Received malformed protocol data from Central. Please refine your request and try again.' });
          commandExecuted = true; // Still consider it "handled"
        }
      } else if (evolvePathMatch?.[1]) {
          try {
              const evolveData = JSON.parse(evolvePathMatch[1]);
              const { pathId, newName, newDescription, newTasks } = evolveData;

              // Basic validation
              if (pathId && newName && newDescription && newTasks) {
                  dispatch({ type: 'EVOLVE_PATH', payload: { pathId, newPathData: { name: newName, description: newDescription, tasks: newTasks } } });
                  addMessageToChat(activeSessionId, { role: 'model', content: `Protocol evolution complete. "${newName}" is now active.` });
                  commandExecuted = true;

              } else {
                  throw new Error("Incomplete evolution data from AI.");
              }
          } catch (error) {
              console.error('Error parsing GENESIS_EVOLVE_PROTOCOL:', error);
              addMessageToChat(activeSessionId, { role: 'model', content: 'System Error: Received malformed evolution data from Central.' });
              commandExecuted = true;
          }
      } else if (updateTasksMatch?.[1]) {
          try {
              const updateData = JSON.parse(updateTasksMatch[1]);
              const { pathId, tasks } = updateData;

              if (pathId && tasks) {
                  const newTasks: Task[] = tasks.map((t: any, i: number) => {
                      const isWeekly = t.type === TaskType.Weekly;
                      return {
                          id: `task-ai-${Date.now()}-${i}`,
                          description: t.description,
                          type: t.type,
                          targetCount: isWeekly ? (t.targetCount || 2) : undefined,
                          currentCount: isWeekly ? (t.currentCount || 0) : undefined,
                          xp: t.xp,
                          statBoost: t.statBoost,
                          isCompleted: false,
                      };
                  });
                  dispatch({ type: 'UPDATE_TASKS_FOR_PATH', payload: { pathId, tasks: newTasks } });

                  const pathName = gameState.paths.find(p => p.id === pathId)?.name || 'Protocol';
                  addMessageToChat(activeSessionId, { role: 'model', content: `Tasks for "${pathName}" have been updated.` });
                  commandExecuted = true;
                  addToast(`Tasks updated for ${pathName}`, 'info');
              } else {
                  throw new Error("Incomplete task update data from AI.");
              }
          } catch (error) {
              console.error('Error parsing GENESIS_UPDATE_TASKS:', error);
              addMessageToChat(activeSessionId, { role: 'model', content: 'System Error: Received malformed task data from Central.' });
              commandExecuted = true;
          }
      } else if (deleteProtocolMatch?.[1]) {
          try {
              const deleteData = JSON.parse(deleteProtocolMatch[1]);
              const { pathId } = deleteData;

              if (pathId) {
                  const protocolToDelete = gameState.paths.find(p => p.id === pathId);
                  if (protocolToDelete) {
                      dispatch({ type: 'DELETE_PATH', payload: pathId });
                      addMessageToChat(activeSessionId, { role: 'model', content: `Protocol "${protocolToDelete.name}" has been archived and removed from active operations.` });
                      commandExecuted = true;
                      addToast(`Protocol Deleted: ${protocolToDelete.name}`, 'info');
                  } else {
                      throw new Error("Protocol not found.");
                  }
              } else {
                  throw new Error("Missing protocol ID for deletion.");
              }
          } catch (error) {
              console.error('Error parsing GENESIS_DELETE_PROTOCOL:', error);
              addMessageToChat(activeSessionId, { role: 'model', content: 'System Error: Could not complete protocol deletion. Protocol may not exist.' });
              commandExecuted = true;
          }
      }
      
      if (!commandExecuted) {
        addMessageToChat(activeSessionId, { role: 'model', content: aiResponse });
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage = 'Central is currently unresponsive. Check system status and try again later.';
      addMessageToChat(activeSessionId, { role: 'model', content: errorMessage });
      addToast('AI connection error.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameState) {
    return <Loader text="Loading Central Interface..." />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-[#050509] text-white font-mono">
      {/* LEFT SIDEBAR - Navigation */}
      <aside className={`
        ${showChatView ? 'hidden' : 'flex'} md:flex flex-col
        w-full md:w-64 bg-black/95 border-r border-purple-500/30 overflow-hidden
      `}>
        <div className="p-6 border-b border-purple-500/30">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-400 mb-4">OPERATIONAL_MODES</h3>
          <nav className="space-y-2">
            <Link to="/dashboard" className="block px-4 py-2.5 text-[11px] uppercase tracking-widest text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 rounded-sm transition-all">
              📊 Dashboard
            </Link>
            <Link to="/paths" className="block px-4 py-2.5 text-[11px] uppercase tracking-widest text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 rounded-sm transition-all">
              🗂️ Protocols
            </Link>
            <div className="block px-4 py-2.5 text-[11px] uppercase tracking-widest text-cyan-400 bg-cyan-900/30 rounded-sm border border-cyan-500/50">
              💬 Central_Link
            </div>
          </nav>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.38em] text-gray-500 mb-4 pb-3 border-b border-purple-500/20">Session_History</h3>
          <div className="space-y-1.5">
            {gameState.chatSessions.length === 0 ? (
              <p className="text-[9px] text-gray-600 italic text-center py-4">No sessions_recorded.</p>
            ) : (
              gameState.chatSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-[9px] uppercase tracking-[0.25em] transition-all group ${
                    activeSessionId === session.id
                      ? 'bg-purple-600/40 border border-purple-400 text-purple-200'
                      : 'border border-gray-700/50 text-gray-400 hover:border-purple-400/50 hover:text-purple-300 hover:bg-purple-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <MessageSquare size={10} className="flex-shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChatAndGoBack(session.id);
                      }}
                      className="flex-shrink-0 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-6 border-t border-purple-500/30">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-sm font-black uppercase text-[10px] tracking-[0.3em] transition-all active:scale-95 border border-purple-400/50"
          >
            <Plus size={14} /> New_Tactical_Link
          </button>
        </div>
      </aside>

      {/* CENTER - Main Chat Area */}
      <main className={`
        ${!showChatView && 'hidden'} md:flex flex-col
        flex-1 bg-gradient-to-br from-black/80 to-purple-900/10 border-r border-purple-500/20 overflow-hidden
      `}>
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 border-b border-purple-500/30 flex items-center justify-between bg-black/60 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowChatView(false)}
              className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[9px] text-purple-400 uppercase tracking-[0.3em] font-black">CENTRAL_LINK</p>
              <h2 className="text-sm font-orbitron font-bold text-white truncate">{activeSession?.title || 'Initialize...'}</h2>
            </div>
          </div>
          <div className="flex-shrink-0 text-[8px] text-gray-500 font-mono">
            STATUS: {activeSession ? 'ONLINE' : 'STANDBY'}
          </div>
        </header>

        {/* Messages Area - Proper scrollable container with flex layout */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4 flex flex-col pb-4">
            {activeSession ? (
              <>
                {activeSession.messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl rounded-sm px-4 py-3 text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-900/30 border border-cyan-500/50 text-cyan-100'
                        : 'bg-gray-800/50 border border-purple-500/30 text-gray-200'
                    }`}>
                      {msg.content === 'Initializing...' ? (
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200" />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap font-mono">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 border border-purple-500/30 rounded-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-100" />
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} className="flex-shrink-0" />
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <Zap size={32} className="text-purple-500 mb-3 opacity-50" />
                <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mb-1">NO_ACTIVE_SESSION</p>
                <p className="text-[9px] text-gray-600">Establish a tactical link to begin operations.</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-purple-500/30 bg-black/80 backdrop-blur z-50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={activeSession ? 'Issue command to Central...' : 'Establish connection first...'}
              className="flex-1 bg-black/60 border border-purple-500/40 rounded-sm px-4 py-2 text-[11px] text-cyan-100 placeholder-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              disabled={!activeSession || isLoading}
            />
            <button
              type="submit"
              disabled={!userInput.trim() || !activeSession || isLoading}
              className="flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-sm transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-purple-400/50 disabled:border-gray-600 flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </main>

      {/* RIGHT SIDEBAR - Asset Log */}
      <aside className="hidden lg:flex flex-col w-80 bg-black/95 border-l border-purple-500/30 overflow-hidden">
        <div className="p-6 border-b border-purple-500/30">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-purple-400 mb-1">ASSET_LOG</p>
          <p className="text-[10px] font-orbitron text-gray-300">{gameState.userName}</p>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-sm p-3">
            <p className="text-[8px] text-purple-400 uppercase tracking-[0.3em] font-black mb-2">ACTIVE_PROTOCOLS</p>
            <div className="space-y-1.5 text-[9px]">
              {gameState.paths.slice(0, 5).map(path => (
                <div key={path.id} className="flex items-center justify-between text-gray-400">
                  <span className="truncate">{path.name}</span>
                  <span className="text-cyan-400 font-mono">Lvl {path.level}</span>
                </div>
              ))}
              {gameState.paths.length > 5 && (
                <p className="text-[8px] text-gray-600 italic">+{gameState.paths.length - 5} more...</p>
              )}
            </div>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-sm p-3">
            <p className="text-[8px] text-cyan-400 uppercase tracking-[0.3em] font-black mb-2">RECENT_ACTIONS</p>
            <p className="text-[9px] text-gray-500 italic">Awaiting system events...</p>
          </div>
        </div>

        <div className="p-6 border-t border-purple-500/30 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-sm text-[9px] uppercase tracking-[0.25em] transition-all border border-gray-700 text-gray-400">
            <Settings size={12} /> Settings
          </button>
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-sm text-[9px] uppercase tracking-[0.25em] transition-all border border-gray-700 text-gray-400">
            <Archive size={12} /> Dashboard
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default OrderPage;
