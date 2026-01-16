// services/localPersistenceService.ts
import { GameState } from '../types';

const USERS_KEY = 'genesis_protocol_users';
const GAMESTATES_KEY = 'genesis_protocol_gamestates';
const LAST_USER_KEY = 'genesis_protocol_last_user';

// Helper to get all user credentials
const getUsers = (): Record<string, string> => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : {};
    } catch (e) {
        return {};
    }
};

// Helper to save all user credentials
const saveUsers = (users: Record<string, string>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Helper to get all game states
const getGameStates = (): Record<string, GameState> => {
    try {
        const states = localStorage.getItem(GAMESTATES_KEY);
        return states ? JSON.parse(states) : {};
    } catch (e) {
        return {};
    }
};

// Helper to save all game states
const saveGameStates = (states: Record<string, GameState>) => {
    localStorage.setItem(GAMESTATES_KEY, JSON.stringify(states));
};

// --- Multi-user functions for LoginPage ---

export const getExistingUsernames = (): string[] => {
    return Object.keys(getUsers());
};

export const createAccount = (username: string, password: string): boolean => {
    const users = getUsers();
    if (users[username]) {
        return false; // User already exists
    }
    users[username] = password;
    saveUsers(users);
    // A new, empty game state will be created by the app logic upon first login.
    return true;
};

export const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const success = users[username] === password;
    if (success) {
        localStorage.setItem(LAST_USER_KEY, username);
    }
    return success;
};

export const deleteAccount = (username: string): void => {
    const users = getUsers();
    delete users[username];
    saveUsers(users);

    const states = getGameStates();
    delete states[username];
    saveGameStates(states);

    if (localStorage.getItem(LAST_USER_KEY) === username) {
        localStorage.removeItem(LAST_USER_KEY);
    }
};

export const getCurrentUser = (): string | null => {
    return localStorage.getItem(LAST_USER_KEY);
};

export const logout = (): void => {
    localStorage.removeItem(LAST_USER_KEY);
};


// --- Single-user-style functions for App.tsx ---

/**
 * Saves the game state for the currently logged-in user.
 */
export const saveGameState = (gameState: GameState): void => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            // This might happen on the very first save for a new account before a reload.
            // Let's try to get it from the gameState itself as a fallback.
            const username = gameState.userName;
            if (!username) {
                 console.error("Could not save game state: no user is logged in or identified.");
                 return;
            }
             const states = getGameStates();
            states[username] = gameState;
            saveGameStates(states);
            return;
        }
        const states = getGameStates();
        states[currentUser] = gameState;
        saveGameStates(states);
    } catch (error) {
        console.error("Could not save game state:", error);
    }
};

/**
 * Loads the game state from local storage.
 * If a user is logged in, it loads their state. Otherwise, it returns null.
 */
export const loadGameState = (): GameState | null => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return null;
        }
        const states = getGameStates();
        const state = states[currentUser] || null;

        // Migration for old achievement data format
        if (state && (state as any).unlockedAchievementIds && !state.unlockedAchievements) {
            state.unlockedAchievements = ((state as any).unlockedAchievementIds as string[]).map(id => ({
                id,
                highestTier: 1,
                unlockedAt: new Date().toISOString()
            }));
            delete (state as any).unlockedAchievementIds;
        }


        return state;
    } catch (error) {
        console.error("Could not load game state:", error);
        return null;
    }
};

/**
 * Deletes all game data for the currently logged-in user.
 */
export const deleteGameState = (): void => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        deleteAccount(currentUser);
    }
    // Also remove other related data like cached greetings or old states
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('metamorphosis_')) {
            localStorage.removeItem(key);
        }
    });
};