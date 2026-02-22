import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { getCompanionGreeting } from '../services/geminiService';
import Card from './ui/Card';
import { Droplets, Footprints, Zap, ChevronRight, Info, Plus } from 'lucide-react';
import { TaskType, Task } from '../types';

const MAX_DAILY_TASKS = 3; // tighter cap for CENTRAL display
const MAX_WEEKLY_TASKS = 2;
const WATER_INCREMENT = 250; // ml
const STEP_INCREMENT = 1000; // steps

// Lightweight helper types for CENTRAL
interface EnrichedTask extends Task {
  pathId: string;
  pathName: string;
}

const CompanionMessage: React.FC = () => {
  const { gameState, completeTask, updateDailyMetrics, addToast } = useGameState();
  const [message, setMessage] = useState<string>('Initializing connection to CENTRAL...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (gameState) {
      const GREETING_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
      const cacheKey = `metamorphosis_greeting_${gameState.userName}`;

      const checkAndFetchGreeting = async () => {
        const cachedGreetingRaw = localStorage.getItem(cacheKey);
        if (cachedGreetingRaw) {
          try {
            const cachedGreeting = JSON.parse(cachedGreetingRaw);
            if (Date.now() - cachedGreeting.timestamp < GREETING_CACHE_DURATION) {
              setMessage(cachedGreeting.message);
              setIsLoading(false);
              return; // Use cached version
            }
          } catch (e) {
            console.error('Failed to parse cached greeting, clearing it.', e);
            localStorage.removeItem(cacheKey); // Clear corrupted data
          }
        }

        // Fetch new greeting if no cache or cache is stale
        setIsLoading(true);
        try {
          const greeting = await getCompanionGreeting(gameState.rank, gameState.stats, gameState.userName);
          setMessage(greeting);
          localStorage.setItem(cacheKey, JSON.stringify({ message: greeting, timestamp: Date.now() }));
        } catch (error) {
          console.error('Error fetching companion greeting:', error);
          setMessage('Connection unstable. Core protocols remain online.');
        } finally {
          setIsLoading(false);
        }
      };

      checkAndFetchGreeting();
    }
  }, [gameState?.rank.name, gameState?.userName]);

  const protocolIntel = useMemo(() => {
    if (!gameState) {
      return {
        bedrock: [] as EnrichedTask[],
        daily: [] as EnrichedTask[],
        weekly: [] as EnrichedTask[],
        behindWeekly: [] as EnrichedTask[],
        loadLabel: 'Idle_Recovery',
      } as const;
    }

    const allTasks: EnrichedTask[] = gameState.paths.flatMap((p) =>
      p.tasks.map((t) => ({ ...(t as Task), pathId: p.id, pathName: p.name }))
    );

    const bedrock = allTasks.filter((t) => t.isNonNegotiable);
    const available = allTasks.filter((t) => !t.isCompleted && !t.isNonNegotiable && !t.isSnoozed);

    const dailies = available.filter((t) => t.type !== TaskType.Weekly);
    const weeklies = available.filter((t) => t.type === TaskType.Weekly);

    // Identify weeklies that are behind on their targetCount
    const behindWeekly = weeklies.filter((t) => t.targetCount && (t.currentCount || 0) < t.targetCount);

    // Prefer diversity: avoid stacking too many from same path
    const pickDiverse = (tasks: EnrichedTask[], max: number) => {
      const byPath: Record<string, number> = {};
      const chosen: EnrichedTask[] = [];
      for (const t of tasks) {
        if (chosen.length >= max) break;
        const count = byPath[t.pathId] || 0;
        if (count >= 2) continue;
        chosen.push(t);
        byPath[t.pathId] = count + 1;
      }
      return chosen;
    };

    // Sort by XP (high first) so CENTRAL picks strongest ops
    const dailyPool = [...dailies].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const weeklyPool = [...weeklies].sort((a, b) => (b.xp || 0) - (a.xp || 0));

    const weekly = pickDiverse(weeklyPool, MAX_WEEKLY_TASKS);

    // Bias: if we have weeklies, leave room so they always show alongside dailies
    const remainingDailySlots = Math.max(0, MAX_DAILY_TASKS - (weekly.length > 0 ? 1 : 0));
    const daily = pickDiverse(dailyPool, remainingDailySlots);

    const totalOps = daily.length + weekly.length;
    let loadLabel: string = 'Idle_Recovery';
    if (totalOps === 0) loadLabel = 'Idle_Recovery';
    else if (totalOps <= 3) loadLabel = 'Light_Compounding';
    else if (totalOps <= 5) loadLabel = 'Optimal_Load';
    else loadLabel = 'Overload_Risk';

    return { bedrock, daily, weekly, behindWeekly, loadLabel } as const;
  }, [gameState]);

  const handleQuickComplete = (task: EnrichedTask) => {
    if (!task || !task.pathId || !task.id) return;
    completeTask(task.pathId, task.id);
  };

  if (!gameState) return null;

  const { dailyMetrics, waterGoal, stepGoal } = gameState;
  const waterPct = Math.min(100, (dailyMetrics.waterIntake / (waterGoal || 1)) * 100);
  const stepsPct = Math.min(100, (dailyMetrics.steps / (stepGoal || 1)) * 100);

  const bumpWater = () => {
    const next = (dailyMetrics.waterIntake || 0) + WATER_INCREMENT;
    updateDailyMetrics({ waterIntake: next });
    addToast?.(`Logged +${WATER_INCREMENT}ml hydration into system.`, 'success');
  };

  const bumpSteps = () => {
    const next = (dailyMetrics.steps || 0) + STEP_INCREMENT;
    updateDailyMetrics({ steps: next });
    addToast?.(`Recorded +${STEP_INCREMENT} steps into telemetry.`, 'success');
  };

  const hasTasks = protocolIntel.daily.length > 0 || protocolIntel.weekly.length > 0;
  const hasBedrock = protocolIntel.bedrock.length > 0;
  const hasBehindWeekly = protocolIntel.behindWeekly.length > 0;

  return (
    <Card className="!border-purple-500/40 !bg-gradient-to-br from-black/95 via-[#050013]/95 to-black/95 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.4),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.35),_transparent_55%)]" />

      <div className="relative z-10 space-y-3.5 md:space-y-4">
        {/* CENTRAL voice */}
        <div className="flex items-start gap-2.5 md:gap-4">
          <div className="mt-0.5 w-6 h-6 md:w-7 md:h-7 rounded-full bg-purple-600/30 border border-purple-400/70 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.7)] flex-shrink-0">
            <Zap size={14} className="text-purple-100" />
          </div>
          <div
            className={`flex-1 text-[10.5px] md:text-[12px] font-semibold text-gray-200 italic leading-relaxed ${
              isLoading ? 'animate-pulse' : ''
            }`}
          >
            <span className="select-text">"{message}"</span>
          </div>
        </div>

        {/* Status strip: link + load */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 text-[9px] md:text-[10px] font-mono uppercase">
          <div className="bg-black/70 border border-purple-500/30 rounded-md px-2 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[7px] tracking-[0.22em] text-gray-500 flex items-center gap-1 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="truncate">Link_Stable</span>
            </span>
            <span className="text-[8px] text-purple-200 font-black">RANK_{gameState.rank.name}</span>
          </div>
          <div className="bg-black/70 border border-cyan-500/40 rounded-md px-2 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[7px] tracking-[0.22em] text-gray-500 flex items-center gap-1 min-w-0">
              <Info size={10} className="text-cyan-400 flex-shrink-0" />
              <span className="truncate">Load_Vector</span>
            </span>
            <span className="text-[8px] text-cyan-200 font-black">{protocolIntel.loadLabel}</span>
          </div>
        </div>

        {/* Bedrock summary */}
        {hasBedrock && (
          <div className="rounded-md bg-black/70 border border-gray-800 px-2.5 py-2 space-y-1.5">
            <div className="flex items-center justify-between text-[7px] md:text-[8px] font-mono uppercase tracking-[0.22em] text-gray-500">
              <span>Bedrock_Protocols</span>
              <span>
                {protocolIntel.bedrock.filter((t) => t.isCompleted).length}/{protocolIntel.bedrock.length} Secured
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-0.5">
              {protocolIntel.bedrock.slice(0, 4).map((t) => (
                <span
                  key={t.id}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-sm border text-[7px] font-mono uppercase tracking-[0.18em] ${
                    t.isCompleted
                      ? 'border-emerald-500/70 bg-emerald-900/30 text-emerald-200'
                      : 'border-gray-700/70 bg-black/70 text-gray-400'
                  }`}
                >
                  {t.isCompleted ? 'STABLE' : 'PENDING'}
                  <span className="mx-1 text-gray-600">//</span>
                  <span className="truncate max-w-[5rem] sm:max-w-[7rem]">{t.description}</span>
                </span>
              ))}
            </div>
            <p className="text-[7px] text-gray-600 font-mono uppercase tracking-[0.22em] mt-0.5">
              Floor must hold before vectors scale. Breaches erode Psyche and streak integrity.
            </p>
          </div>
        )}

        {/* Water + Steps */}
        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          <div className="bg-black/70 border border-sky-500/40 rounded-md px-2.5 py-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.22em] text-gray-500 flex items-center gap-1">
                <Droplets size={11} className="text-sky-400" /> Hydration
              </span>
              <button
                type="button"
                onClick={bumpWater}
                className="inline-flex items-center gap-1 rounded-sm border border-sky-500/60 bg-sky-900/30 px-1.5 py-0.5 text-[7px] md:text-[8px] font-mono text-sky-100 active:scale-95"
              >
                <Plus size={10} /> +{WATER_INCREMENT}ml
              </button>
            </div>
            <div className="flex items-center justify-between text-[8px] md:text-[9px] font-mono text-sky-200">
              <span>{dailyMetrics.waterIntake ?? 0}/{waterGoal}ml</span>
              <span>{Math.round(waterPct)}%</span>
            </div>
            <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full transition-all duration-700"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>
          <div className="bg-black/70 border border-emerald-500/40 rounded-md px-2.5 py-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.22em] text-gray-500 flex items-center gap-1">
                <Footprints size={11} className="text-emerald-400" /> Steps
              </span>
              <button
                type="button"
                onClick={bumpSteps}
                className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/60 bg-emerald-900/30 px-1.5 py-0.5 text-[7px] md:text-[8px] font-mono text-emerald-100 active:scale-95"
              >
                <Plus size={10} /> +{STEP_INCREMENT}
              </button>
            </div>
            <div className="flex items-center justify-between text-[8px] md:text-[9px] font-mono text-emerald-200">
              <span>{dailyMetrics.steps ?? 0}/{stepGoal}</span>
              <span>{Math.round(stepsPct)}%</span>
            </div>
            <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-lime-300 rounded-full transition-all duration-700"
                style={{ width: `${stepsPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today stack + weekly catch-up */}
        <div className="mt-1.5 space-y-2">
          <div className="flex items-center justify-between text-[7px] md:text-[8.5px] font-black uppercase tracking-[0.25em] text-gray-500">
            <span>CENTRAL // Today_Stack</span>
            <span>
              {protocolIntel.daily.length}D / {protocolIntel.weekly.length}W
            </span>
          </div>

          {hasTasks ? (
            <div className="space-y-1.5">
              {protocolIntel.daily.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleQuickComplete(task)}
                  className="w-full flex items-center justify-between rounded-sm border border-gray-800 bg-black/70 px-2.5 py-2 text-left transition-all active:scale-[0.99] hover:border-purple-400/70 hover:bg-purple-950/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 text-center text-[7px] md:text-[8px] font-mono font-black text-purple-300 border border-purple-500/60 bg-purple-950/60 rounded-[2px] px-1 py-0.5">
                      DAY
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-tight text-gray-100 truncate">
                        {task.description}
                      </p>
                      <p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-[0.22em] truncate">
                        {task.pathName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[8px] md:text-[9px] font-mono text-purple-200 font-semibold">+{task.xp}v</span>
                    <div className="w-6 h-6 rounded-[2px] border border-purple-400/70 flex items-center justify-center bg-black/80">
                      <ChevronRight size={13} className="text-purple-200" />
                    </div>
                  </div>
                </button>
              ))}

              {protocolIntel.weekly.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleQuickComplete(task)}
                  className="w-full flex items-center justify-between rounded-sm border border-amber-700/70 bg-amber-950/20 px-2.5 py-2 text-left transition-all active:scale-[0.99] hover:border-amber-400 hover:bg-amber-900/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 text-center text-[7px] md:text-[8px] font-mono font-black text-amber-300 border border-amber-500/70 bg-amber-950/70 rounded-[2px] px-1 py-0.5">
                      WEEK
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-tight text-gray-100 truncate">
                        {task.description}
                      </p>
                      <p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase tracking-[0.22em] truncate">
                        {task.pathName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[8px] md:text-[9px] font-mono text-amber-200 font-semibold">+{task.xp}v</span>
                    <div className="w-6 h-6 rounded-[2px] border border-amber-400/80 flex items-center justify-center bg-black/80">
                      <ChevronRight size={13} className="text-amber-200" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-1.5 rounded-md border border-dashed border-gray-800/80 bg-black/50 px-3 py-3 text-center text-[8px] md:text-[9px] text-gray-500">
              No active protocols selected. CENTRAL will adapt once you add or unsnooze habits in your Paths.
            </div>
          )}

          {hasBehindWeekly && (
            <div className="mt-1.5 rounded-md border border-amber-700/60 bg-amber-950/10 px-2.5 py-2 space-y-1.5">
              <div className="flex items-center justify-between text-[7px] md:text-[8px] font-mono uppercase tracking-[0.22em] text-amber-300">
                <span>Weekly_Burst_Status</span>
                <span>Catch-Up_Window</span>
              </div>
              <div className="space-y-0.5 max-h-16 overflow-y-auto pr-0.5">
                {protocolIntel.behindWeekly.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-[7px] md:text-[8px] text-amber-100">
                    <span className="truncate max-w-[9rem] sm:max-w-[12rem]">
                      {t.description}
                    </span>
                    {t.targetCount && (
                      <span className="font-mono text-amber-300">
                        {(t.currentCount || 0)}/{t.targetCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[7px] text-amber-200/80 font-mono uppercase tracking-[0.22em]">
                Full Burst XP unlocks when weekly vectors hit target counts before reset.
              </p>
            </div>
          )}
        </div>

        <p className="mt-0.5 text-[7px] md:text-[7.5px] text-gray-600 font-mono uppercase tracking-[0.22em]">
          Stack is capped on purpose. Genesis optimizes for consistency, balance, and compounding 	7 not overload.
        </p>
      </div>
    </Card>
  );
};

export default CompanionMessage;