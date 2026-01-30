export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  activity: {
    lastLogin: string;
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