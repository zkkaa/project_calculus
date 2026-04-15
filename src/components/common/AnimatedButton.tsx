"use client";

import { useRouter } from "next/navigation";
// import { animatePageOut } from "../../lib/animatePage";

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  arrowColor?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function AnimatedButton({
  href,
  onClick,
  children,
  className = "",
  arrowColor,
  variant = "primary",
  size = "md",
  disabled = false,
}: AnimatedButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (href) {
    //   animatePageOut(href, router);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: "py-1.5 px-4 sm:px-6 text-xs sm:text-sm",
    md: "py-2 px-6 sm:px-8 text-sm sm:text-base",
    lg: "py-3 px-8 sm:px-10 text-base sm:text-lg",
  };

  // Icon size variants
  const iconSizes = {
    sm: "w-5 h-5 sm:w-6 sm:h-6",
    md: "w-6 h-6 sm:w-8 sm:h-8",
    lg: "w-7 h-7 sm:w-9 sm:h-9",
  };

  // Arrow color based on variant
  const defaultArrowColor = arrowColor || "fill-black dark:fill-gray-300 group-hover:fill-gray-800";

  // Variant styles
  const variantClasses = {
    primary: "border-black dark:border-gray-200 before:bg-sky-400 hover:border-gray-800 hover:dark:border-gray-300",
    secondary: "border-purple-500 dark:border-purple-400 before:bg-purple-400 hover:border-purple-700 hover:dark:border-purple-300",
    outline: "border-gray-400 dark:border-gray-500 before:bg-gray-400 hover:border-gray-600 hover:dark:border-gray-400",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex justify-center gap-2 items-center 
        bg-transparent backdrop-blur-md 
        lg:font-semibold isolation-auto 
        before:absolute before:w-full before:transition-all before:duration-700 
        before:hover:w-full before:-left-full before:hover:left-0 
        before:rounded-full before:-z-10 before:aspect-square 
        before:hover:scale-150 before:hover:duration-700 
        relative z-10 overflow-hidden border-2 rounded-full group
        transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
      <svg
        className={`
          ${iconSizes[size]}
          justify-end group-hover:rotate-90 
          group-hover:bg-gray-50 
          text-black dark:text-gray-200 
          ease-linear duration-300 rounded-full 
          border border-black dark:border-gray-200 
          group-hover:border-none p-1.5 sm:p-2 rotate-45
          ${disabled ? "opacity-50" : ""}
        `}
        viewBox="0 0 16 19"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
          className={defaultArrowColor}
        />
      </svg>
    </button>
  );
}