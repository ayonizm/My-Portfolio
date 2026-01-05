// Data Store - Firebase Firestore backend with localStorage fallback

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const COLLECTIONS = {
  PROJECTS: 'projects',
  ACHIEVEMENTS: 'achievements',
  ANALYSIS: 'analysis',
  HERO: 'hero',
  SETTINGS: 'settings'
};

// Local storage keys (for fallback and caching)
const KEYS = {
  PROJECTS: 'portfolio_projects',
  ACHIEVEMENTS: 'portfolio_achievements',
  ANALYSIS: 'portfolio_analysis',
  HERO: 'portfolio_hero',
  AUTH: 'portfolio_auth'
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return db && !db._settings?.host?.includes('YOUR_');
  } catch {
    return false;
  }
};

// Default data with unique IDs
const dispatchLocalChange = (key, data) => {
  try {
    const event = new CustomEvent('local-data-change', {
      detail: { key, data }
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.error('Error dispatching local event:', err);
  }
};

const defaultProjects = [
  {
    id: 'proj_1001',
    name: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  },
  {
    id: 'proj_1002',
    name: 'AI Chat Application',
    description: 'Real-time chat application powered by AI. Built with Next.js, WebSocket, and OpenAI API for intelligent conversations.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  },
  {
    id: 'proj_1003',
    name: 'Portfolio Dashboard',
    description: 'A dynamic portfolio management system with analytics, project tracking, and customizable themes.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  }
];

const defaultAchievements = [
  {
    id: 'ach_1001',
    title: 'Best Developer Award 2024',
    description: 'Recognized for outstanding contribution to open-source projects and innovative solutions.',
    icon: '🏆',
    date: '2024'
  },
  {
    id: 'ach_1002',
    title: 'Hackathon Winner',
    description: 'First place in the National Coding Championship among 500+ participants.',
    icon: '🥇',
    date: '2023'
  },
  {
    id: 'ach_1003',
    title: 'Tech Speaker',
    description: 'Delivered keynote presentations at major tech conferences on modern web development.',
    icon: '🎤',
    date: '2023'
  },
  {
    id: 'ach_1004',
    title: '100+ Projects Completed',
    description: 'Successfully delivered over 100 client projects across various industries.',
    icon: '✨',
    date: '2024'
  }
];

const defaultHero = {
  name: 'Md.Fahim Ahmed',
  tagline: 'Full Stack Developer & Creative Technologist',
  description: 'I craft beautiful, high-performance web experiences that blend stunning design with cutting-edge technology. Passionate about creating digital solutions that make a difference.',
  image: '/port.jpg'
};

const defaultAnalysis = [
  {
    id: 'ana_1001',
    title: 'Codeforces Solved',
    value: '696',
    image: '', // Use existing icon logic or placeholder if image is empty
    icon: '📊'
  },
  {
    id: 'ana_1002',
    title: 'GitHub Repos',
    value: '3',
    image: '',
    icon: '🐙'
  },
  {
    id: 'ana_1003',
    title: 'AtCoder Solved',
    value: '131',
    image: '',
    icon: '🍙'
  },
  {
    id: 'ana_1004',
    title: 'VJudge Solved',
    value: '904',
    image: '',
    icon: '⚖️'
  }
];

// Reset all data to defaults (clears corrupted data)
export const resetAllData = () => {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(defaultProjects));
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(defaultAnalysis));
  localStorage.setItem(KEYS.HERO, JSON.stringify(defaultHero));
  console.log('All data reset to defaults');
};

// Clean duplicate IDs in localStorage
export const cleanData = () => {
  // Projects
  const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || '[]');
  const uniqueProjects = Array.from(new Map(projects.map(p => [p.id, p])).values());
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(uniqueProjects));
  // Achievements
  const achievements = JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS) || '[]');
  const uniqueAchievements = Array.from(new Map(achievements.map(a => [a.id, a])).values());
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(uniqueAchievements));
  // Analysis
  const analysis = JSON.parse(localStorage.getItem(KEYS.ANALYSIS) || '[]');
  const uniqueAnalysis = Array.from(new Map(analysis.map(a => [a.id, a])).values());
  localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(uniqueAnalysis));
};

// Initialize data in localStorage if not exists
const initializeLocalData = () => {
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  }
  if (!localStorage.getItem(KEYS.ANALYSIS)) {
    localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(defaultAnalysis));
  }
  if (!localStorage.getItem(KEYS.HERO)) {
    localStorage.setItem(KEYS.HERO, JSON.stringify(defaultHero));
  }
  // Clean any duplicate IDs that might have been introduced
  cleanData();
};

// Initialize Firebase data if empty
const initializeFirebaseData = async () => {
  try {
    /* Auto-seeding disabled to allow empty state
    // Check if projects collection is empty
    const projectsSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
    if (projectsSnap.empty) {
      for (const project of defaultProjects) {
        await addDoc(collection(db, COLLECTIONS.PROJECTS), project);
      }
    }

    // Check if achievements collection is empty
    const achievementsSnap = await getDocs(collection(db, COLLECTIONS.ACHIEVEMENTS));
    if (achievementsSnap.empty) {
      for (const achievement of defaultAchievements) {
        await addDoc(collection(db, COLLECTIONS.ACHIEVEMENTS), achievement);
      }
    }
    */

    // Check if hero document exists
    const heroDoc = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'hero'));
    if (!heroDoc.exists()) {
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'hero'), defaultHero);
    }
  } catch (error) {
    console.log('Firebase not configured, using localStorage');
  }
};

// ============ PROJECTS ============

export const getProjects = async () => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.PROJECTS));
      const projects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects)); // Cache locally
      return projects;
    } catch (error) {
      console.error('Firebase error, falling back to localStorage:', error);
    }
  }

  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.PROJECTS) || '[]');
};

export const getProjectsSync = () => {
  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.PROJECTS) || '[]');
};

export const getFeaturedProjects = async () => {
  const projects = await getProjects();
  return projects.filter(p => p.featured).slice(0, 3);
};

export const getFeaturedProjectsSync = () => {
  return getProjectsSync().filter(p => p.featured).slice(0, 3);
};

export const addProject = async (project) => {
  const newProject = { ...project, id: Date.now().toString() };

  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), project);
      newProject.id = docRef.id;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  // Also update localStorage
  const projects = getProjectsSync();
  projects.push(newProject);
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  dispatchLocalChange(KEYS.PROJECTS, projects);

  return newProject;
};

export const updateProject = async (id, updates) => {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), updates);
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  // Also update localStorage
  const projects = getProjectsSync();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    dispatchLocalChange(KEYS.PROJECTS, projects);
  }
  return projects[index];
};

export const deleteProject = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  // Also update localStorage
  const projects = getProjectsSync().filter(p => p.id !== id);
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  dispatchLocalChange(KEYS.PROJECTS, projects);
};

// ============ ACHIEVEMENTS ============

export const getAchievements = async () => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.ACHIEVEMENTS));
      const achievements = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return achievements;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS) || '[]');
};

export const getAchievementsSync = () => {
  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS) || '[]');
};

export const addAchievement = async (achievement) => {
  const newAchievement = { ...achievement, id: Date.now().toString() };

  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ACHIEVEMENTS), achievement);
      newAchievement.id = docRef.id;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const achievements = getAchievementsSync();
  achievements.push(newAchievement);
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  dispatchLocalChange(KEYS.ACHIEVEMENTS, achievements);

  return newAchievement;
};

export const updateAchievement = async (id, updates) => {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.ACHIEVEMENTS, id), updates);
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const achievements = getAchievementsSync();
  const index = achievements.findIndex(a => a.id === id);
  if (index !== -1) {
    achievements[index] = { ...achievements[index], ...updates };
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    dispatchLocalChange(KEYS.ACHIEVEMENTS, achievements);
  }
  return achievements[index];
};

export const deleteAchievement = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ACHIEVEMENTS, id));
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const achievements = getAchievementsSync().filter(a => a.id !== id);
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  dispatchLocalChange(KEYS.ACHIEVEMENTS, achievements);
};

// ============ HERO ============

export const getHero = async () => {
  if (isFirebaseConfigured()) {
    try {
      const heroDoc = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'hero'));
      if (heroDoc.exists()) {
        const heroData = heroDoc.data();
        localStorage.setItem(KEYS.HERO, JSON.stringify(heroData));
        return heroData;
      }
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.HERO) || '{}');
};

export const getHeroSync = () => {
  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.HERO) || '{}');
};

export const updateHero = async (updates) => {
  const currentHero = getHeroSync();
  const newHero = { ...currentHero, ...updates };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'hero'), newHero);
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  localStorage.setItem(KEYS.HERO, JSON.stringify(newHero));
  localStorage.setItem(KEYS.HERO, JSON.stringify(newHero));
  dispatchLocalChange(KEYS.HERO, newHero);
  return newHero;
};

// ============ ANALYSIS ============

export const getAnalysis = async () => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.ANALYSIS));
      const analysis = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
      return analysis;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.ANALYSIS) || '[]');
};

export const getAnalysisSync = () => {
  initializeLocalData();
  return JSON.parse(localStorage.getItem(KEYS.ANALYSIS) || '[]');
};

export const addAnalysis = async (item) => {
  const newItem = { ...item, id: Date.now().toString() };

  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ANALYSIS), item);
      newItem.id = docRef.id;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const analysis = getAnalysisSync();
  analysis.push(newItem);
  localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
  try {
    dispatchLocalChange(KEYS.ANALYSIS, analysis);
  } catch (e) {
    console.error("Dispatch error", e);
  }

  return newItem;
};

export const updateAnalysis = async (id, updates) => {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.ANALYSIS, id), updates);
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const analysis = getAnalysisSync();
  const index = analysis.findIndex(a => a.id === id);
  if (index !== -1) {
    analysis[index] = { ...analysis[index], ...updates };
    localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
    dispatchLocalChange(KEYS.ANALYSIS, analysis);
  }
  return analysis[index];
};

export const deleteAnalysis = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ANALYSIS, id));
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }

  const analysis = getAnalysisSync().filter(a => a.id !== id);
  localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
  dispatchLocalChange(KEYS.ANALYSIS, analysis);
};



// ============ AUTH ============

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const login = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(KEYS.AUTH, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(KEYS.AUTH);
};

export const isAuthenticated = () => {
  return localStorage.getItem(KEYS.AUTH) === 'true';
};

// ============ UTILITIES ============

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};



// Subscribe to real-time updates (Firebase + LocalStorage support)
export const subscribeToProjects = (callback) => {
  if (isFirebaseConfigured()) {
    return onSnapshot(collection(db, COLLECTIONS.PROJECTS), (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
      callback(projects);
    });
  }

  // Local storage listener (Same tab)
  const localHandler = (e) => {
    if (e.detail && e.detail.key === KEYS.PROJECTS) {
      callback(e.detail.data);
    }
  };
  window.addEventListener('local-data-change', localHandler);

  // Storage event listener (Cross tab)
  const storageHandler = (e) => {
    if (e.key === KEYS.PROJECTS && e.newValue) {
      callback(JSON.parse(e.newValue));
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('local-data-change', localHandler);
    window.removeEventListener('storage', storageHandler);
  };
};

export const subscribeToAchievements = (callback) => {
  if (isFirebaseConfigured()) {
    return onSnapshot(collection(db, COLLECTIONS.ACHIEVEMENTS), (snapshot) => {
      const achievements = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      callback(achievements);
    });
  }

  const localHandler = (e) => {
    if (e.detail && e.detail.key === KEYS.ACHIEVEMENTS) {
      callback(e.detail.data);
    }
  };
  window.addEventListener('local-data-change', localHandler);

  const storageHandler = (e) => {
    if (e.key === KEYS.ACHIEVEMENTS && e.newValue) {
      callback(JSON.parse(e.newValue));
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('local-data-change', localHandler);
    window.removeEventListener('storage', storageHandler);
  };
};

export const subscribeToAnalysis = (callback) => {
  if (isFirebaseConfigured()) {
    return onSnapshot(collection(db, COLLECTIONS.ANALYSIS), (snapshot) => {
      const analysis = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(analysis));
      callback(analysis);
    });
  }

  const localHandler = (e) => {
    if (e.detail && e.detail.key === KEYS.ANALYSIS) {
      callback(e.detail.data);
    }
  };
  window.addEventListener('local-data-change', localHandler);

  const storageHandler = (e) => {
    if (e.key === KEYS.ANALYSIS && e.newValue) {
      callback(JSON.parse(e.newValue));
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('local-data-change', localHandler);
    window.removeEventListener('storage', storageHandler);
  };
};

// Cleanup duplicate data in Firebase (same content, different IDs)
export const cleanupFirebaseDuplicates = async () => {
  if (!isFirebaseConfigured()) return { projects: 0, achievements: 0 };

  let deletedProjects = 0;
  let deletedAchievements = 0;

  try {
    // Cleanup Projects
    const projectsSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
    const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const uniqueProjectNames = new Set();

    for (const p of projects) {
      const key = p.name?.toLowerCase().trim();
      if (!key) continue;

      if (uniqueProjectNames.has(key)) {
        // Duplicate found, delete it
        await deleteDoc(doc(db, COLLECTIONS.PROJECTS, p.id));
        deletedProjects++;
      } else {
        uniqueProjectNames.add(key);
      }
    }

    // Cleanup Achievements
    const achievementsSnap = await getDocs(collection(db, COLLECTIONS.ACHIEVEMENTS));
    const achievements = achievementsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const uniqueAchievementTitles = new Set();

    for (const a of achievements) {
      const key = a.title?.toLowerCase().trim();
      if (!key) continue;

      if (uniqueAchievementTitles.has(key)) {
        // Duplicate found, delete it
        await deleteDoc(doc(db, COLLECTIONS.ACHIEVEMENTS, a.id));
        deletedAchievements++;
      } else {
        uniqueAchievementTitles.add(key);
      }
    }

    // Force refresh local data
    await getProjects();
    await getAchievements();

    return { projects: deletedProjects, achievements: deletedAchievements };

  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    throw error;
  }
};

// Initialize data
initializeLocalData();
if (isFirebaseConfigured()) {
  initializeFirebaseData();
}
