// src/types/auth.ts

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  assigneeId: string;
  assigneeName: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "manager" | "developer" | "designer";
  department: string;
  isOnline: boolean;
  lastActive: Date;
  createdAt: Date;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface DashboardState {
  tasks: Task[];
  users: User[];
  filter: {
    status: string;
    priority: string;
    assignee: string;
    search: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: User["role"];
  department: string;
}

export interface AuthContextType {
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
}

// Real-time collaboration types
export interface CollaborationEvent {
  type:
    | "user_joined"
    | "user_left"
    | "task_updated"
    | "user_typing"
    | "cursor_moved";
  userId: string;
  userName: string;
  timestamp: Date;
  data?: any;
}

export interface UserSession {
  userId: string;
  userName: string;
  avatar: string;
  role: string;
  joinedAt: Date;
  lastActivity: Date;
  isTyping: boolean;
  currentPage: string;
}
