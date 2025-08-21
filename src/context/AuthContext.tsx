import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthState,
  AuthContextType,
  User,
  LoginCredentials,
  RegisterData,
} from "../types/auth";
import { useNavigate } from "react-router-dom";

export const MOCK_USERS = [
  {
    id: "1",
    email: "admin@company.com",
    password: "admin123",
    name: "Admin User",
    avatar: "👨‍💼",
    role: "admin" as const,
    department: "IT",
    isOnline: true,
    lastActive: new Date(),
    createdAt: new Date(),
    permissions: [
      { resource: "tasks", actions: ["create", "read", "update", "delete"] },
      { resource: "users", actions: ["create", "read", "update", "delete"] },
    ],
  },
  {
    id: "2",
    email: "jane@company.com",
    password: "jane123",
    name: "Jane Smith",
    avatar: "👩‍💻",
    role: "manager" as const,
    department: "Engineering",
    isOnline: true,
    lastActive: new Date(),
    createdAt: new Date(),
    permissions: [
      { resource: "tasks", actions: ["create", "read", "update", "delete"] },
      { resource: "users", actions: ["read", "update"] },
    ],
  },
  {
    id: "3",
    email: "john@company.com",
    password: "john123",
    name: "John Doe",
    avatar: "👨‍💻",
    role: "developer" as const,
    department: "Engineering",
    isOnline: false,
    lastActive: new Date(Date.now() - 15 * 60 * 1000),
    createdAt: new Date(),
    permissions: [{ resource: "tasks", actions: ["create", "read", "update"] }],
  },
  {
    id: "4",
    email: "sarah@company.com",
    password: "sarah123",
    name: "Sarah Wilson",
    avatar: "👩‍🎨",
    role: "designer" as const,
    department: "Design",
    isOnline: true,
    lastActive: new Date(),
    createdAt: new Date(),
    permissions: [{ resource: "tasks", actions: ["create", "read", "update"] }],
  },
];

// Auth Context
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: User };

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return initialAuthState;
    case "UPDATE_PROFILE":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthContext = createContext<
  | {
      auth: AuthState;
      login: (email: string, password: string) => Promise<void>;
      logout: () => void;
      updateProfile: (updates: Partial<User>) => void;
    }
  | undefined
>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Mock API
const mockAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const token = `mock_token_${user.id}_${Date.now()}`;
          resolve({ user: userWithoutPassword as User, token });
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  },
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, dispatch] = useReducer(authReducer, initialAuthState);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const result = await mockAPI.login(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: result });
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!auth.user) return;
    const updatedUser = { ...auth.user, ...updates };
    dispatch({ type: "UPDATE_PROFILE", payload: updatedUser });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Permission checking hook
export const usePermissions = () => {
  const { auth } = useAuth();

  const hasPermission = (resource: string, action: string): boolean => {
    if (!auth.user) return false;

    const permission = auth.user.permissions.find(
      (p) => p.resource === resource
    );
    return permission ? permission.actions.includes(action as any) : false;
  };

  const isAdmin = (): boolean => {
    return auth.user?.role === "admin" || false;
  };

  const isManager = (): boolean => {
    return (
      auth.user?.role === "manager" || auth.user?.role === "admin" || false
    );
  };

  const canEditTask = (task: any): boolean => {
    if (!auth.user) return false;

    // Admin and managers can edit any task
    if (isAdmin() || isManager()) return true;

    // Users can edit their own tasks
    if (task.createdBy === auth.user.id || task.assigneeId === auth.user.id) {
      return hasPermission("tasks", "update");
    }

    return false;
  };

  const canDeleteTask = (task: any): boolean => {
    if (!auth.user) return false;

    // Only admin and managers can delete tasks
    if (isAdmin() || isManager()) {
      return hasPermission("tasks", "delete");
    }

    // Task creator can delete their own task
    return task.createdBy === auth.user.id && hasPermission("tasks", "delete");
  };

  return {
    hasPermission,
    isAdmin,
    isManager,
    canEditTask,
    canDeleteTask,
  };
};
