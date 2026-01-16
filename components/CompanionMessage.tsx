import React, { useState, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { getCompanionGreeting } from '../services/geminiService';
import Card from './ui/Card';

const CompanionMessage: React.FC = () => {
  const { gameState } = useGameState();
  const [message, setMessage] = useState<string>('Initializing connection to Central...');
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
                console.error("Failed to parse cached greeting, clearing it.", e);
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
            console.error("Error fetching companion greeting:", error);
            setMessage("Connection unstable. System protocols active.");
        } finally {
            setIsLoading(false);
        }
      };

      checkAndFetchGreeting();
    }
  }, [gameState?.rank.name, gameState?.userName]);

  return (
    <Card className="mb-6 !border-purple-500/30">
      <p className={`text-center font-semibold text-gray-300 italic ${isLoading ? 'animate-pulse' : ''}`}>
        "{message}"
      </p>
    </Card>
  );
};

export default CompanionMessage;