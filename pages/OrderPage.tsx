

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { createOrderChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';
import { ChatMessage, Path, Task, TaskType, IconName, SubStatName, AttributeRankName } from '../types';
import Loader from '../components/ui/Loader';
import { Send, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
      const chat: Chat = createOrderChatSession(gameState, history);
      const result = await chat.sendMessage({ message: messageToSend });
      // FIX: Access the .text property to get the response content, instead of calling a method.
      const aiResponse = result.text ?? '';
      
      // Parse for structured commands
      const createPathMatch = aiResponse.match(/<GENESIS_CREATE_PATH>([\s\S]*?)<\/GENESIS_CREATE_PATH>/);
      const evolvePathMatch = aiResponse.match(/<GENESIS_EVOLVE_PROTOCOL>([\s\S]*?)<\/GENESIS_EVOLVE_PROTOCOL>/);
      const updateTasksMatch = aiResponse.match(/<GENESIS_UPDATE_TASKS>([\s\S]*?)<\/GENESIS_UPDATE_TASKS>/);

      let commandExecuted = false;

      if (createPathMatch?.[1]) {
        try {
          const pathData = JSON.parse(createPathMatch[1]) as Path;
          
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
              dispatch({ type: 'ADD_PATH', payload: pathData });
              addMessageToChat(activeSessionId, { role: 'model', content: `Protocol "${pathData.name}" established. Your directives are now available in the Protocols interface.` });
              commandExecuted = true;
              addToast(`New Protocol: ${pathData.name}`, 'special');
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
                  addToast(`Protocol Evolved: ${newName}`, 'special');

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
                  const newTasks: Task[] = tasks.map((t: any, i: number) => ({
                      id: `task-ai-${Date.now()}-${i}`,
                      description: t.description,
                      type: t.type,
                      xp: t.xp,
                      statBoost: t.statBoost,
                      isCompleted: false,
                  }));
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
    <div className="flex h-[calc(100vh-4rem)] md:h-screen">
      {/* Sessions Sidebar */}
      <div className={`
        ${showChatView ? 'hidden' : 'flex'} md:flex flex-col
        w-full md:w-1/4 bg-gray-900/50 p-4 border-r border-gray-700/50 h-full
      `}>
        <h2 className="text-xl font-orbitron font-bold mb-4">Chat Logs</h2>
        <button onClick={handleNewChat} className="flex items-center justify-center gap-2 w-full p-2 mb-4 bg-purple-600 hover:bg-purple-500 rounded-md">
          <Plus size={18} /> New Query
        </button>
        <div className="flex-grow overflow-y-auto">
          {gameState.chatSessions.map(session => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-3 rounded-md cursor-pointer mb-2 flex justify-between items-center ${activeSessionId === session.id ? 'bg-purple-500/30' : 'hover:bg-gray-700/50'}`}
            >
              <p className="truncate text-sm font-semibold">{session.title}</p>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteChatAndGoBack(session.id); }} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`
        ${!showChatView && 'hidden'} md:flex flex-col
        w-full md:w-3/4 bg-bg-deep h-full
      `}>
         <div className="md:hidden flex-shrink-0 p-2 border-b border-gray-700/50 flex items-center">
            <button onClick={() => setShowChatView(false)} className="p-2 text-gray-400 hover:text-white">
                <ArrowLeft />
            </button>
            <h2 className="text-lg font-orbitron font-bold ml-2 truncate">{activeSession?.title || 'Chat'}</h2>
        </div>
        <div ref={chatEndRef} className="flex-grow p-6 overflow-y-auto">
          {activeSession ? (
            <div className="space-y-6">
              {activeSession.messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl p-4 rounded-lg ${msg.role === 'user' ? 'bg-purple-800' : 'bg-gray-700'}`}>
                    {msg.content === 'Initializing...' ? (
                      <div className="typing-indicator"><div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div></div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-xl p-4 rounded-lg bg-gray-700">
                      <div className="typing-indicator"><div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div></div>
                    </div>
                 </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
              <p>No active session.</p>
              <p>Select a chat log or create a new one to begin.</p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={activeSession ? 'Issue a command or ask a question...' : 'Create a new query first...'}
              className="flex-grow bg-gray-800/50 border border-gray-700 rounded-md p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              disabled={!activeSession || isLoading}
            />
            <button
              type="submit"
              disabled={!userInput.trim() || !activeSession || isLoading}
              className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
