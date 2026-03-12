export interface TaskStep {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface Assignment {
  title: string;
  description: string;
  steps: TaskStep[];
  difficulty: string;
  estimatedTime: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface AppState {
  currentAssignment: Assignment | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
