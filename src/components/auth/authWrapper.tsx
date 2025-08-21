import { Loader } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Login from "../../Pages/Login";
import { Home } from "../../Pages/Home";

// Auth Wrapper Component
export const AuthWrapper: React.FC = () => {
  const { auth } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Show loading screen while checking authentication
  if (auth.isLoading) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-4 shadow-lg mb-4 inline-block">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Show auth forms if not authenticated
  if (!auth.isAuthenticated) {
    return <Login onSwitchToRegister={() => setAuthMode("register")} />;
  }

  // Show protected content if authenticated
  return <Home />;
};
