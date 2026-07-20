'use client';

import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function ToggleSwitch({ label, checked, onChange, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-700 bg-zinc-900/50">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-zinc-100 cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {description && (
          <span className="text-xs text-zinc-400">{description}</span>
        )}
      </div>
      
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${
          checked ? 'bg-zinc-100' : 'bg-zinc-700'
        }`}
      >
        <span className="sr-only">Toggle {label}</span>
        <motion.span
          layout
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'bg-zinc-900' : 'bg-zinc-300'
          }`}
        />
      </button>
    </div>
  );
}
