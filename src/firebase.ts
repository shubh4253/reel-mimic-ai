import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Project } from './types/index.ts';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test as required by Firebase integration guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify network or configuration.');
    }
  }
}

// Google Sign-In helper
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        lastLogin: new Date().toISOString()
      }, { merge: true });
    }
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Save or sync a project to user's Firestore collection
export async function saveProjectToFirestore(userId: string, project: Project): Promise<void> {
  try {
    const projRef = doc(db, 'users', userId, 'projects', project.id);
    await setDoc(projRef, {
      ...project,
      userId,
      syncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('Error saving project to Firestore:', e);
  }
}

// Load user's projects from Firestore
export async function loadProjectsFromFirestore(userId: string): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'users', userId, 'projects');
    const snapshot = await getDocs(projectsCol);
    const list: Project[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Project);
    });
    return list;
  } catch (e) {
    console.warn('Error loading projects from Firestore:', e);
    return [];
  }
}
