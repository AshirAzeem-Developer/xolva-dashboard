import React, { useMemo, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Globe, Search } from "lucide-react";
import { GlobeDemo } from "../components/ChildUis/Globe";
import CustomInput from "../components/CustomInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const GlobeBg = useMemo(() => GlobeDemo(), []);

  return (
    <div className="relative min-h-screen  w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
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

      <div className="flex flex-col sm:flex-row w-full h-screen relative z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center w-1/2 p-16">
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
        <div className="flex justify-center items-center w-1/2 p-10">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Log In to{" "}
                  <span className="text-cyan-400">XOLVA Dashboard</span>
                </h2>
              </div>

              <div className="space-y-6">
                {/* Email Field */}
                <CustomInput
                  showLeftIcon
                  Icon={Search}
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={setEmail}
                />

                {/* Password Field */}
                <div className="relative group">
                  <CustomInput
                    showLeftIcon
                    Icon={Lock}
                    type={"password"}
                    placeholder="Your Password"
                    value={password}
                    onChange={setPassword}
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400/20"
                    />
                    <span className="text-gray-300 text-sm">Remember me</span>
                  </label>
                  <a href="#" className="text-[#000]">
                    <span className="text-white">Forgot Password?</span>
                  </a>
                </div>

                {/* Login Button */}
                <button
                  onClick={() =>
                    console.log("Login attempted with:", {
                      email,
                      password,
                      rememberMe,
                    })
                  }
                  className="w-full py-3 rounded-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition"
                >
                  Log In
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                  <a href="#" className="text-white hover:underline">
                    <span className="text-white">Sign Up</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Removed Globe Component */}

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      {/* Globe in bottom right corner */}
      <div className="fixed bottom-48  w-full h-80  pointer-events-none">
        {GlobeBg}
      </div>
    </div>
  );
};

export default Login;
