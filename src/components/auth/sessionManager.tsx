import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const SessionManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { auth, logout } = useAuth();
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Simulate session timeout (in real app, this would be based on token expiry)
    const sessionDuration = 30 * 60 * 1000; // 30 minutes
    const warningTime = 5 * 60 * 1000; // Show warning 5 minutes before expiry

    const sessionStart = Date.now();

    const checkSession = () => {
      const elapsed = Date.now() - sessionStart;
      const remaining = sessionDuration - elapsed;

      if (remaining <= 0) {
        // Session expired
        logout();
        return;
      }

      if (remaining <= warningTime && !showSessionWarning) {
        setShowSessionWarning(true);
        setSessionTimeLeft(Math.ceil(remaining / 1000));
      }

      if (showSessionWarning && remaining > warningTime) {
        setShowSessionWarning(false);
        setSessionTimeLeft(null);
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, logout, showSessionWarning]);

  const extendSession = () => {
    setShowSessionWarning(false);
    setSessionTimeLeft(null);
    // In real app, this would refresh the token
    console.log("Session extended");
  };

  return (
    <>
      {children}

      {/* Session Warning Modal */}
      {showSessionWarning && sessionTimeLeft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Session Expiring Soon
              </h3>
              <p className="text-gray-600 mb-4">
                Your session will expire in{" "}
                <span className="font-bold text-red-600">
                  {Math.floor(sessionTimeLeft / 60)}:
                  {(sessionTimeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={extendSession}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Extend Session
                </button>
                <button
                  onClick={logout}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
