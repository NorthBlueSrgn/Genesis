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
    Firestore,
    query,
    collection,
    where,
    getDocs
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

/**
 * Validate email format using RFC 5322 simplified pattern
 */
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

export const signUp = async (email: string, password: string, username: string): Promise<User> => {
    // Validate email format before attempting to create account
    if (!isValidEmail(email)) {
        throw new Error('Please provide a valid email address (e.g., user@example.com)');
    }
    
    // Validate username format (alphanumeric, underscores, hyphens, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens');
    }
    
    // Check if username already exists in Firestore
    const usernameQuery = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
        throw new Error('Username already taken. Please choose a different username.');
    }
    
    // Create Firebase Auth user with email
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    
    // Store username in Firestore for lookup
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: username.toLowerCase(),
        displayName: username,
        email: email.toLowerCase(),
        createdAt: new Date(),
        uid: userCredential.user.uid
    });
    
    return userCredential.user;
};

/**
 * Sign in using either username or email
 * Looks up username in Firestore to get email if needed
 */
export const signIn = async (emailOrUsername: string, password: string): Promise<User> => {
    let email = emailOrUsername;
    
    // Check if input looks like an email
    if (!emailOrUsername.includes('@')) {
        // It's likely a username, look it up
        const usernameQuery = query(collection(db, 'users'), where('username', '==', emailOrUsername.toLowerCase()));
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (usernameSnapshot.empty) {
            throw new Error('Username or email not found');
        }
        
        const userData = usernameSnapshot.docs[0].data();
        email = userData.email;
    }
    
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