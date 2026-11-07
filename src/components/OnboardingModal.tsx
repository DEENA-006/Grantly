"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, LayoutGrid, CheckCircle2, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Discover Your Matches",
    desc: "Every scholarship displays your personalized match percentage and a specific explanation of why you qualify based on your GPA and major.",
  },
  {
    step: "02",
    icon: LayoutGrid,
    title: "Track Applications Tactilely",
    desc: "Organize applications across Saved, In Progress, and Submitted columns. Drag cards freely or use quick one-tap status buttons.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Never Miss a Requirement",
    desc: "Open any application to track your documents checklist, draft notes, review essay prompts, and sync deadlines directly with your calendar.",
  },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain"
            style={{ color: "var(--ink)" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-black/[0.06]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest font-semibold" style={{ color: "var(--accent)" }}>
                  How Grantly Works
                </span>
                <h3 className="font-display-serif text-2xl sm:text-3xl leading-tight mt-1">
                  Your Scholarship Journey in 3 Steps
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {STEPS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.step}
                    className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                    style={{ background: "#F3F4F6" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: "var(--ink)" }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/40">
                          Step {s.step}
                        </span>
                        <h4 className="font-semibold text-sm sm:text-base leading-none">
                          {s.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-black/[0.06]">
              <span className="text-[11px] font-mono text-black/40 uppercase tracking-wider">
                Built for students
              </span>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white shadow-md flex items-center gap-2 transition-all hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

