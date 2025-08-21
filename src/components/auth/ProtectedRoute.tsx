import { useAuth, usePermissions } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  requiredRole?: "admin" | "manager" | "developer" | "designer";
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}) => {
  const { auth } = useAuth();
  const { hasPermission, isAdmin } = usePermissions();

  if (!auth.isAuthenticated || !auth.user) {
    return null; // This will be handled by AuthWrapper
  }

  // Check role requirement
  if (requiredRole) {
    const userRole = auth.user.role;

    // Admin can access everything
    if (userRole !== "admin") {
      // Check role hierarchy: admin > manager > developer/designer
      const roleHierarchy: Record<string, number> = {
        admin: 4,
        manager: 3,
        developer: 2,
        designer: 2,
      };

      const userLevel = roleHierarchy[userRole] || 0;
      const requiredLevel = roleHierarchy[requiredRole] || 0;

      if (userLevel < requiredLevel) {
        return (
          fallback || (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Access Denied
                </h2>
                <p className="text-gray-600 mb-4">
                  You don't have permission to access this page. Required role:{" "}
                  <span className="font-semibold">{requiredRole}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Your role: <span className="font-semibold">{userRole}</span>
                </p>
              </div>
            </div>
          )
        );
      }
    }
  }

  // Check permission requirement
  if (requiredPermission) {
    const { resource, action } = requiredPermission;

    if (!hasPermission(resource, action)) {
      return (
        fallback || (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <div className="text-6xl mb-4">⛔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Insufficient Permissions
              </h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to perform this action.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-sm">
                  <strong>Required:</strong> {action} on {resource}
                </p>
                <p className="text-sm">
                  <strong>Your role:</strong> {auth.user.role}
                </p>
              </div>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
};
