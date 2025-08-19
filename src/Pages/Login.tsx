import React from "react";
import { images } from "../assets/images";
import CustomInput from "../components/CustomInput";
import { Mail, Lock } from "lucide-react";

const Login: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${images.LoginBg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundClip: "border-box",
      }}
      className="flex w-screen h-screen text-white"
    >
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-16 ">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={images.XOlva_Logo}
              alt="Logo"
              className="w-[20vw] h-auto grayscale"
            />
          </div>
          <p className="text-lg mb-2">Empowering Teams with Innovation</p>
          <p className="mt-4 text-xl font-medium leading-relaxed">
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
          <div className="flex gap-4 mt-8">
            <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
              Learn More
            </button>
            <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Login Box */}
      <div className="flex justify-center items-center w-1/2 p-10">
        <div className="w-full max-w-md bg-white/10 border border-white/15 h-3/4 backdrop-blur-lg p-10 rounded-md shadow-[0_0_25px_rgba(0,200,255,0.3)]">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Log In to <span className="text-cyan-400">XOLVA Dashboard</span>
          </h2>

          {/* Email */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full pl-10 pr-3 py-3 bg-black/30 text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Your Password"
              className="w-full pl-10 pr-3 py-3 bg-black/30 text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-300 mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Remember Me
            </label>
            <a href="#" className="text-cyan-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition">
            Log In
          </button>

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-300 mt-6">
            Don’t have an account?{" "}
            <a href="#" className="text-cyan-400 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
