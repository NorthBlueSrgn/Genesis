// services/firebaseService.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from "firebase/analytics";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    deleteUser,
    User,
    Auth
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    deleteDoc,
    Firestore
} from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
import { GameState } from '../types';

let app: FirebaseApp;
export let auth: Auth;
let db: Firestore;
let analytics: Analytics;

try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed. Please ensure firebaseConfig.ts is set up correctly.", error);
    auth = {} as Auth;
    db = {} as Firestore;
}

/**
 * Firestore does not support 'undefined' values.
 * This helper recursively converts undefined to null to ensure compatibility.
 */
const sanitizeForFirestore = (data: any): any => {
    if (data === undefined) return null;
    if (data === null || typeof data !== 'object') return data;
    
    if (Array.isArray(data)) {
        return data.map(item => sanitizeForFirestore(item));
    }
    
    const sanitized: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            sanitized[key] = sanitizeForFirestore(value);
        }
    }
    return sanitized;
};

export const onAuthStateChangedHelper = (callback: (user: User | null) => void) => {
    if(!auth.onAuthStateChanged) return () => {};
    return onAuthStateChanged(auth, callback);
};

export const signUp = async (email: string, password: string, username: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    return userCredential.user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const signOutUser = (): Promise<void> => {
    return signOut(auth);
};

export const deleteUserAccount = async (): Promise<void> => {
    const user = auth.currentUser;
    if (user) {
        await deleteDoc(doc(db, 'userStates', user.uid));
        await deleteUser(user);
    } else {
        throw new Error("No user is currently signed in.");
    }
};

export const saveGameState = async (userId: string, gameState: GameState): Promise<void> => {
    if (!userId) return;
    const userDocRef = doc(db, 'userStates', userId);
    const sanitizedState = sanitizeForFirestore(gameState);
    await setDoc(userDocRef, sanitizedState);
};

export const loadGameState = async (userId: string): Promise<GameState | null> => {
    if (!userId) return null;
    const userDocRef = doc(db, 'userStates', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as GameState;
    } else {
        return null;
    }
};