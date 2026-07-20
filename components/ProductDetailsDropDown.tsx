'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LucideIcon } from 'lucide-react';

export type ProductDetailSection = {
    id: string;
    label: string;
    icon: LucideIcon;
    content?: string | null;
};

type ProductDetailsDropDownProps = {
    sections: ProductDetailSection[];
    defaultOpenSection?: string | null;
};

type DropDownItemProps = {
    section: ProductDetailSection;
    isOpen: boolean;
    onToggle: () => void;
};

function DropDownItem({ section, isOpen, onToggle }: DropDownItemProps) {
    const Icon = section.icon;

    return (
        <div className="border border-white/10 rounded-xl bg-ma-surface-container/50 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-ma-primary/30">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors group"
            >
                <div className="flex items-center gap-4 text-ma-on-surface font-bold text-sm tracking-[0.1em]">
                    <Icon className="w-5 h-5 text-ma-primary/80 group-hover:text-ma-primary transition-colors" />
                    {section.label}
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-ma-on-surface-variant transition-transform duration-400 ease-[0.16,1,0.3,1] ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-6 pb-6 text-ma-on-surface-variant text-base leading-relaxed whitespace-pre-line border-t border-white/5 pt-5 font-normal">
                            {section.content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductDetailsDropDown({
    sections,
    defaultOpenSection = null,
}: ProductDetailsDropDownProps) {
    const [openSection, setOpenSection] = useState<string | null>(defaultOpenSection);

    const visibleSections = sections.filter((section) => section.content);

    if (visibleSections.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-4"
        >
            {visibleSections.map((section) => (
                <DropDownItem
                    key={section.id}
                    section={section}
                    isOpen={openSection === section.id}
                    onToggle={() =>
                        setOpenSection(openSection === section.id ? null : section.id)
                    }
                />
            ))}
        </motion.div>
    );
}
