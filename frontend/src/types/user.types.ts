export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  // New Gamification Fields
  totalPoints: number;
  level: number;
  currentXp: number;
  // Link to Portfolio (ID string or null)
  portfolio?: string; 
  activity: {
    lastLogin: string; // ISO Date string
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}