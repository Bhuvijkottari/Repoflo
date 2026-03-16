import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-[#0f172a]/70 backdrop-blur-md px-4 py-2 text-sm text-white placeholder:text-gray-400 transition-all duration-200",
          "focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };