import React from "react";

type inputProps = {
  type: string;
  placeholder: string;
  className?: string;
  onChange: () => void;
};

const CustomInput: React.FC<inputProps> = ({
  type,
  placeholder,
  className,
  onChange,
}) => {
  return (
    <input
      onChange={onChange}
      type={type ? type : "text"}
      placeholder={placeholder}
      className={`${
        className && className
      } w-full pl-10 pr-3 py-3 bg-black/30 text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
    />
  );
};

export default CustomInput;
