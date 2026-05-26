import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';

export interface LearningPathPlatform {
  name: string;
  url: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  platforms: LearningPathPlatform[];
  status: 'Not Started' | 'In Progress' | 'Completed';
  dateAdded: string;
}

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

interface UserProfile {
  name: string;
  role: string;
  currentSkills: string[];
  learningGoals: string[];
  learningPath: LearningPathItem[];
  experienceYears?: number;
  fieldOfExperience?: string;
  theme: 'light' | 'dark';
  preferredCurrency: CurrencyCode;
  email?: string;
  contactNumber?: string;
  age?: number;
  fieldOfInterest?: string;
  preferredCareerDomain?: string;
  password?: string;
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addToLearningPath: (item: LearningPathItem) => void;
  removeFromLearningPath: (id: string) => void;
  clearLearningPath: () => void;
  toggleTheme: () => void;
  setPreferredCurrency: (currency: CurrencyCode) => void;
}

const defaultProfile: UserProfile = {
  name: "Guest User",
  role: "Aspiring AI Engineer",
  currentSkills: ["Python", "JavaScript"],
  learningGoals: ["Machine Learning", "Cloud Architecture"],
  learningPath: [],
  experienceYears: 0,
  fieldOfExperience: "General Tech",
  theme: 'light',
  preferredCurrency: 'USD',
  email: "guest@example.com",
  contactNumber: "1234567890",
  age: 25,
  fieldOfInterest: "Artificial Intelligence",
  preferredCareerDomain: "AI & Data Science",
  password: "password123",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const normalizeLearningPath = (value: unknown): LearningPathItem[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    if (typeof entry === 'string') {
      const id = entry.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return {
        id,
        title: entry,
        platforms: [],
        status: 'Not Started' as const,
        dateAdded: new Date().toLocaleDateString(),
      };
    }

    if (entry && typeof entry === 'object') {
      const obj = entry as Partial<LearningPathItem>;
      return {
        id: typeof obj.id === 'string'
          ? obj.id
          : typeof obj.title === 'string'
            ? obj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            : `item-${Math.random().toString(36).slice(2, 8)}`,
        title: typeof obj.title === 'string' ? obj.title : 'Saved Course',
        platforms: Array.isArray(obj.platforms)
          ? obj.platforms.filter((p): p is LearningPathPlatform => p && typeof p === 'object' && typeof p.name === 'string' && typeof p.url === 'string')
          : [],
        status: obj.status === 'In Progress' || obj.status === 'Completed' ? obj.status : 'Not Started',
        dateAdded: typeof obj.dateAdded === 'string' ? obj.dateAdded : new Date().toLocaleDateString(),
      };
    }

    return {
      id: `item-${Math.random().toString(36).slice(2, 8)}`,
      title: 'Saved Course',
      platforms: [],
      status: 'Not Started',
      dateAdded: new Date().toLocaleDateString(),
    };
  });
};

const normalizeUserProfile = (raw: unknown): UserProfile => {
  if (!raw || typeof raw !== 'object') return defaultProfile;
  const asRecord = raw as Record<string, unknown>;
  const learningGoals = Array.isArray(asRecord.learningGoals)
    ? asRecord.learningGoals.filter((item): item is string => typeof item === 'string')
    : typeof asRecord.learningGoals === 'string'
      ? [asRecord.learningGoals]
      : defaultProfile.learningGoals;
  const currentSkills = Array.isArray(asRecord.currentSkills)
    ? asRecord.currentSkills.filter((item): item is string => typeof item === 'string')
    : defaultProfile.currentSkills;

  return {
    ...defaultProfile,
    ...(asRecord as Partial<UserProfile>),
    currentSkills,
    learningGoals,
    learningPath: normalizeLearningPath(asRecord.learningPath),
    experienceYears: typeof asRecord.experienceYears === 'number' ? asRecord.experienceYears : defaultProfile.experienceYears,
    fieldOfExperience: typeof asRecord.fieldOfExperience === 'string' ? asRecord.fieldOfExperience : defaultProfile.fieldOfExperience,
    theme: asRecord.theme === 'dark' ? 'dark' : 'light',
    preferredCurrency: ['USD', 'EUR', 'GBP', 'INR'].includes(String(asRecord.preferredCurrency))
      ? (String(asRecord.preferredCurrency) as CurrencyCode)
      : defaultProfile.preferredCurrency,
    email: typeof asRecord.email === 'string' ? asRecord.email : defaultProfile.email,
    contactNumber: typeof asRecord.contactNumber === 'string' ? asRecord.contactNumber : defaultProfile.contactNumber,
    age: typeof asRecord.age === 'number' ? asRecord.age : defaultProfile.age,
    fieldOfInterest: typeof asRecord.fieldOfInterest === 'string' ? asRecord.fieldOfInterest : defaultProfile.fieldOfInterest,
    preferredCareerDomain: typeof asRecord.preferredCareerDomain === 'string' ? asRecord.preferredCareerDomain : defaultProfile.preferredCareerDomain,
    password: typeof asRecord.password === 'string' ? asRecord.password : defaultProfile.password,
  };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile;
    try {
      const storedProfile = window.localStorage.getItem('userProfile');
      return storedProfile ? normalizeUserProfile(JSON.parse(storedProfile)) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setUserProfile((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const setPreferredCurrency = (currency: CurrencyCode) => {
    setUserProfile((prev) => ({ ...prev, preferredCurrency: currency }));
  };

  const addToLearningPath = (item: LearningPathItem) => {
    setUserProfile((prev) => {
      if (prev.learningPath.some((entry) => entry.id === item.id)) return prev;
      return { ...prev, learningPath: [...prev.learningPath, item] };
    });
  };

  const removeFromLearningPath = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      learningPath: prev.learningPath.filter((entry) => entry.id !== id),
    }));
  };

  const clearLearningPath = () => {
    setUserProfile((prev) => ({ ...prev, learningPath: [] }));
  };

  useEffect(() => {
    try {
      window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
      window.localStorage.setItem('preferredTheme', userProfile.theme);
      document.documentElement.classList.toggle('dark', userProfile.theme === 'dark');
    } catch {
      // Ignore persistence failures in unsupported browsers.
    }
  }, [userProfile]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        toggleTheme,
        setPreferredCurrency,
        addToLearningPath,
        removeFromLearningPath,
        clearLearningPath,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
