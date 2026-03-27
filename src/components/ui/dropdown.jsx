import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
function DropdownMenu({ trigger, children, align = "right", className }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && <motion.div
    initial={{ opacity: 0, scale: 0.92, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.92, y: 8 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className={cn(
      "absolute z-[100] mt-2 w-56 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden p-1.5",
      align === "right" ? "right-0" : "left-0"
    )}
    style={{ boxShadow: "0 20px 50px -12px rgba(0,0,0,0.15)" }}
    onClick={() => setIsOpen(false)}
  >
            {children}
          </motion.div>}
      </AnimatePresence>
    </div>;
}
function DropdownMenuItem({
  children,
  onClick,
  className,
  destructive,
  icon: Icon
}) {
  return <button
    onClick={(e) => {
      if (onClick) onClick(e);
    }}
    className={cn(
      "w-full text-left px-3.5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 rounded-xl",
      destructive ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10" : "text-slate-600 dark:text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400",
      className
    )}
  >
      {Icon && <Icon size={16} strokeWidth={2.5} className="shrink-0" />}
      {children}
    </button>;
}
function DropdownMenuSeparator() {
  return <div className="h-[1px] bg-slate-100 dark:bg-slate-800/60 my-1 mx-2" />;
}
export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator
};
