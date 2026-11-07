"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ExternalLink, Calendar } from "lucide-react";
import { Scholarship, getDeadlineLabel } from "@/data/mockData";

interface ScholarshipCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScholarships: Scholarship[];
  onSaveGrant: (grantId: string) => void;
  isGrantInBoard: (grantId: string) => boolean;
}

export function ScholarshipCompareModal({
  isOpen,
  onClose,
  selectedScholarships,
  onSaveGrant,
  isGrantInBoard,
}: ScholarshipCompareModalProps) {
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

  if (!isOpen || selectedScholarships.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col overscroll-contain"
          style={{ color: "var(--ink)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] flex-shrink-0">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest font-semibold" style={{ color: "var(--accent)" }}>
                Scholarship Comparison
              </span>
              <h3 className="font-display-serif text-2xl sm:text-3xl leading-tight mt-0.5">
                Side-by-Side Scholarship Comparison
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison Table / Grid */}
          <div className="flex-1 overflow-x-auto overflow-y-auto py-6">
            <div
              className="grid gap-6 min-w-[640px]"
              style={{
                gridTemplateColumns: `repeat(${selectedScholarships.length}, minmax(280px, 1fr))`,
              }}
            >
              {selectedScholarships.map((grant) => {
                const deadline = getDeadlineLabel(grant.deadline);
                const inBoard = isGrantInBoard(grant.id);

                return (
                  <div
                    key={grant.id}
                    className="p-6 rounded-2xl bg-[#F8F9FA] border border-black/[0.06] flex flex-col justify-between space-y-6"
                  >
                    {/* Top Info */}
                    <div className="space-y-4">
                      {/* Org & Tags */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-black/50 font-medium">
                          {grant.organization}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/5">
                          {grant.awardType}
                        </span>
                      </div>

                      {/* Title & Amount */}
                      <div>
                        <h4 className="font-display-serif text-xl sm:text-2xl leading-snug">
                          {grant.title}
                        </h4>
                        <div className="font-mono text-2xl font-bold text-[#18181B] mt-1">
                          {grant.amount}
                        </div>
                        <div className="text-[10px] font-mono text-black/40 uppercase tracking-wider">
                          {grant.amountNote}
                        </div>
                      </div>

                      {/* Match Score & Badge */}
                      <div className="p-3 rounded-xl bg-white border border-black/[0.04] space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-black/50 uppercase tracking-wider">Compatibility</span>
                          <span className="font-semibold text-emerald-600">{grant.matchScore}% Match</span>
                        </div>
                        <p className="text-[11px] text-black/60 italic leading-relaxed">
                          {grant.whyMatched}
                        </p>
                      </div>

                      {/* Deadline */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest block">
                          Application Deadline
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-black/40" />
                          <span className="text-xs font-medium">
                            {new Date(grant.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full urgency-${deadline.urgency}`}>
                            {deadline.label}
                          </span>
                        </div>
                      </div>

                      {/* Required Documents */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest block">
                          Required Documents ({grant.documentsRequired.length})
                        </span>
                        <ul className="text-xs text-black/70 space-y-1">
                          {grant.documentsRequired.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-black/30 mt-0.5">•</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Essay Prompts */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest block">
                          Essays Required
                        </span>
                        <div className="text-xs text-black/70">
                          {grant.essayPrompts.length > 0 ? (
                            <span className="text-amber-700 font-medium">
                              {grant.essayPrompts.length} Prompt{grant.essayPrompts.length > 1 ? "s" : ""} required
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">
                              No essay prompts required!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-black/[0.06] space-y-2">
                      <a
                        href={grant.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[44px] px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 bg-[#18181B] text-white hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Apply on Portal</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onSaveGrant(grant.id)}
                        disabled={inBoard}
                        className={`w-full min-h-[42px] px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all ${
                          inBoard
                            ? "bg-black/5 text-black/40 cursor-default"
                            : "bg-white text-black border border-black/15 hover:border-black"
                        }`}
                      >
                        {inBoard ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Your Tracker</span>
                          </>
                        ) : (
                          <span>+ Save to Tracker</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-black/50 font-mono uppercase tracking-wider flex-shrink-0">
            <span>Comparing {selectedScholarships.length} of {selectedScholarships.length} selected</span>
            <button
              onClick={onClose}
              className="text-black hover:underline cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
