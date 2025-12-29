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
  HERO: 'hero',
  SETTINGS: 'settings'
};

// Local storage keys (for fallback and caching)
const KEYS = {
  PROJECTS: 'portfolio_projects',
  ACHIEVEMENTS: 'portfolio_achievements',
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

// Default data
const defaultProjects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  },
  {
    id: '2',
    name: 'AI Chat Application',
    description: 'Real-time chat application powered by AI. Built with Next.js, WebSocket, and OpenAI API for intelligent conversations.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  },
  {
    id: '3',
    name: 'Portfolio Dashboard',
    description: 'A dynamic portfolio management system with analytics, project tracking, and customizable themes.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    link: 'https://github.com',
    featured: true
  }
];

const defaultAchievements = [
  {
    id: '1',
    title: 'Best Developer Award 2024',
    description: 'Recognized for outstanding contribution to open-source projects and innovative solutions.',
    icon: '🏆',
    date: '2024'
  },
  {
    id: '2',
    title: 'Hackathon Winner',
    description: 'First place in the National Coding Championship among 500+ participants.',
    icon: '🥇',
    date: '2023'
  },
  {
    id: '3',
    title: 'Tech Speaker',
    description: 'Delivered keynote presentations at major tech conferences on modern web development.',
    icon: '🎤',
    date: '2023'
  },
  {
    id: '4',
    title: '100+ Projects Completed',
    description: 'Successfully delivered over 100 client projects across various industries.',
    icon: '✨',
    date: '2024'
  }
];

const defaultHero = {
  name: 'Md.Anisul Haque Chowdhury',
  tagline: 'Full Stack Developer & Creative Technologist',
  description: 'I craft beautiful, high-performance web experiences that blend stunning design with cutting-edge technology. Passionate about creating digital solutions that make a difference.',
  image: '/port.jpg'
};

// Initialize data in localStorage if not exists
const initializeLocalData = () => {
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  }
  if (!localStorage.getItem(KEYS.HERO)) {
    localStorage.setItem(KEYS.HERO, JSON.stringify(defaultHero));
  }
};

// Initialize Firebase data if empty
const initializeFirebaseData = async () => {
  try {
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
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
};

// ============ ACHIEVEMENTS ============

export const getAchievements = async () => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.ACHIEVEMENTS));
      const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  return newHero;
};

// ============ AUTH ============

const ADMIN_PASSWORD = 'ayon@6594';

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

// Subscribe to real-time updates (Firebase only)
export const subscribeToProjects = (callback) => {
  if (isFirebaseConfigured()) {
    return onSnapshot(collection(db, COLLECTIONS.PROJECTS), (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
      callback(projects);
    });
  }
  return () => { }; // Return empty unsubscribe function
};

export const subscribeToAchievements = (callback) => {
  if (isFirebaseConfigured()) {
    return onSnapshot(collection(db, COLLECTIONS.ACHIEVEMENTS), (snapshot) => {
      const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      callback(achievements);
    });
  }
  return () => { };
};

// Initialize data
initializeLocalData();
if (isFirebaseConfigured()) {
  initializeFirebaseData();
}
