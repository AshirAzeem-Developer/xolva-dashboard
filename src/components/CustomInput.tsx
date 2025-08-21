import { Eye, EyeOff, LucideIcon } from "lucide-react";
import React, { useState } from "react";

type InputProps = {
  showLeftIcon: boolean;
  Icon: LucideIcon;
  type: string;
  placeholder: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

const CustomInput: React.FC<InputProps> = ({
  type,
  placeholder,
  className = "",
  onChange,
  Icon,
  showLeftIcon,
  value,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && isPasswordVisible ? "text" : type;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`relative group ${className}`}>
      {showLeftIcon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${showLeftIcon ? "pl-12" : "pl-4"} ${
          isPasswordType ? "pr-12" : "pr-4"
        } py-4 bg-black/30 text-white rounded-xl border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 placeholder-gray-400`}
      />
      {isPasswordType && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-cyan-400 transition-colors"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default CustomInput;
