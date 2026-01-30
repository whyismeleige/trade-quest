import { User } from "./user.types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

export interface RootState {
  auth: AuthState;
  notification: NotificationState;
}
