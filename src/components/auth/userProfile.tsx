import { Edit2, LogOut, Save, UserCheck, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export const UserProfile: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { auth, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.user?.name || "",
    department: auth.user?.department || "",
    avatar: auth.user?.avatar || "👤",
  });

  const avatarOptions = [
    "👨‍💻",
    "👩‍💻",
    "🧑‍💻",
    "👨‍💼",
    "👩‍💼",
    "🧑‍💼",
    "👨‍🎨",
    "👩‍🎨",
    "🧑‍🎨",
    "👤",
  ];

  if (!isOpen || !auth.user) return null;

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    manager: "bg-blue-100 text-blue-800",
    developer: "bg-green-100 text-green-800",
    designer: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            {isEditing ? (
              <div>
                <div className="text-6xl mb-4">{formData.avatar}</div>
                <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, avatar }))
                      }
                      className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                        formData.avatar === avatar
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="text-6xl mb-2">{auth.user.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {auth.user.name}
                </h3>
                <p className="text-gray-600">{auth.user.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm rounded-full capitalize ${
                      roleColors[auth.user.role]
                    }`}
                  >
                    <UserCheck size={14} className="mr-1" />
                    {auth.user.role}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium">{auth.user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{auth.user.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    auth.user.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {auth.user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-600">
                {new Date(auth.user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                {auth.user.permissions.map((permission, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-sm text-gray-800 capitalize">
                      {permission.resource}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {permission.actions.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: auth.user?.name || "",
                      department: auth.user?.department || "",
                      avatar: auth.user?.avatar || "👤",
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
