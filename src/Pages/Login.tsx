import React, { useMemo, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Search,
  AlertCircle,
  Loader,
} from "lucide-react";
import { GlobeDemo } from "../components/ChildUis/Globe";
import CustomInput from "../components/CustomInput";
import { useAuth } from "../context/AuthContext";
import { LoginCredentials } from "../types/auth";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

const Login: React.FC<{ onSwitchToRegister: () => void }> = ({
  onSwitchToRegister,
}) => {
  const { login, auth } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  // Memoized components
  const GlobeBg = useMemo(() => GlobeDemo(), []);
  const AnimatedBackgroundParticles = useMemo(
    () => (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    ),
    []
  );

  // Demo credentials helper
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const demoUsers = [
    { email: "admin@company.com", password: "admin123", role: "Admin" },
    { email: "jane@company.com", password: "jane123", role: "Manager" },
    { email: "john@company.com", password: "john123", role: "Developer" },
    { email: "sarah@company.com", password: "sarah123", role: "Designer" },
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      console.log(formData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData((prev) => ({ ...prev, email, password }));
  };

  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {AnimatedBackgroundParticles}

      <div className="flex flex-col lg:flex-row w-full h-screen relative z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center lg:w-1/2 w-full p-8 lg:p-16">
          <div className="flex flex-col items-start max-w-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">XOLVA</h1>
                <p className="text-cyan-300 text-sm">Dashboard</p>
              </div>
            </div>

            <p className="text-white text-lg mb-2">
              Empowering Teams with Innovation
            </p>

            <p className="mt-4 text-xl font-medium leading-relaxed text-white mb-8">
              Welcome to{" "}
              <span className="text-[#9ae6ff] font-bold">
                XOLVA Realtime Collaboration Dashboard
              </span>{" "}
              —
              <br />
              your all-in-one platform for seamless teamwork, instant
              communication, and efficient project management.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                Explore Features
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex justify-center items-center lg:w-1/2 w-full p-6 lg:p-10">
          <div className="w-full max-w-md">
            {auth.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <span className="text-red-800 text-sm">{auth.error}</span>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Log In to{" "}
                  <span className="text-cyan-400">XOLVA Dashboard</span>
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="relative group">
                    <CustomInput
                      showLeftIcon
                      Icon={Mail}
                      type="email"
                      value={formData.email}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          email: value,
                        }));
                        if (validationErrors.email) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            email: "",
                          }));
                        }
                      }}
                      placeholder="Enter your email"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 font-bold">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative group">
                    <CustomInput
                      showLeftIcon
                      Icon={Lock}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          password: value,
                        }));
                        if (validationErrors.password) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            password: "",
                          }));
                        }
                      }}
                      placeholder="Enter your password"
                    />

                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600 font-bold">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rememberMe: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400/20"
                      />
                      <span className="text-gray-300 text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={auth.isLoading}
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                    className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      transform: isLoginHovered ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {auth.isLoading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Demo Credentials Section */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                    className="text-xs text-gray-400 hover:text-gray-300 mb-2"
                  >
                    {showDemoCredentials ? "Hide" : "Show"} Demo Credentials
                  </button>
                  {showDemoCredentials && (
                    <div className="space-y-2">
                      {demoUsers.map((user, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            handleDemoLogin(user.email, user.password)
                          }
                          className="w-full text-left p-2 text-xs bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="text-cyan-300">{user.role}</div>
                          <div className="text-gray-400">{user.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Globe in bottom right corner */}
      <div className="fixed bottom-48 w-full h-80 pointer-events-none">
        {GlobeBg}
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Login;
