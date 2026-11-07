"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Trash2,
  Send,
  ExternalLink,
  Info,
  Calendar,
} from "lucide-react";
import { Scholarship, BoardItem, BoardStatus, getDeadlineLabel } from "@/data/mockData";

interface KanbanBoardProps {
  boardItems: BoardItem[];
  scholarships: Scholarship[];
  onMoveItem: (grantId: string, toStatus: BoardStatus) => void;
  onRemoveItem: (grantId: string) => void;
  onOpenDetail: (grant: Scholarship) => void;
  onUpdateBoardItem: (grantId: string, updates: Partial<BoardItem>) => void;
}

const COLUMNS: { id: BoardStatus; title: string; subtitle: string; dotColor: string }[] = [
  { id: "saved", title: "Saved", subtitle: "Review & plan", dotColor: "#18181B" },
  { id: "in_progress", title: "In Progress", subtitle: "Preparing docs", dotColor: "#F59E0B" },
  { id: "submitted", title: "Submitted", subtitle: "Awaiting decision", dotColor: "#10B981" },
];

export function KanbanBoard({
  boardItems,
  scholarships,
  onMoveItem,
  onRemoveItem,
  onOpenDetail,
}: KanbanBoardProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const getGrantById = (id: string): Scholarship | undefined =>
    scholarships.find((s) => s.id === id);

  const getItemsByStatus = (status: BoardStatus) =>
    boardItems.filter((item) => item.status === status);

  const handleFinalSubmit = (grantId: string) => {
    setSubmittingId(grantId);
    setTimeout(() => {
      onMoveItem(grantId, "submitted");
      setSubmittingId(null);
    }, 500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-baseline justify-between pb-2">
        <div>
          <span
            className="text-[11px] font-mono uppercase tracking-widest font-medium block mb-1"
            style={{ color: "var(--accent)" }}
          >
            Application Tracker
          </span>
          <h2 className="font-display-serif text-3xl font-normal" style={{ color: "var(--ink)" }}>
            My Board
          </h2>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-faint)" }}>
          {boardItems.length} tracked
        </span>
      </div>

      {/* Columns */}
      <div className="space-y-4">
        {COLUMNS.map((col) => {
          const items = getItemsByStatus(col.id);

          return (
            <div
              key={col.id}
              className="rounded-2xl p-4 sm:p-5 space-y-3 transition-colors border border-white/40 shadow-sm"
              style={{ background: "rgba(244, 244, 245, 0.65)", backdropFilter: "blur(16px)" }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: col.dotColor }}
                  />
                  <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                    {col.title}
                  </span>
                  <span
                    className="text-[11px] font-mono uppercase tracking-wider hidden sm:inline"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    · {col.subtitle}
                  </span>
                </div>
                <span
                  className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border border-white/60"
                  style={{ background: "rgba(255,255,255,0.7)", color: "var(--ink-muted)" }}
                >
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="min-h-[72px] space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const grant = getGrantById(item.grantId);
                    if (!grant) return null;
                    const isSubmitting = submittingId === grant.id;
                    const deadline = getDeadlineLabel(grant.deadline);

                    return (
                      <motion.div
                        key={grant.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        drag
                        dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
                        dragElastic={0.2}
                        whileDrag={{
                          scale: 1.02,
                          boxShadow: "0 16px 36px -6px rgba(0,0,0,0.1)",
                          cursor: "grabbing",
                          zIndex: 30,
                        }}
                        style={{ touchAction: "pan-y" }}
                        className="rounded-xl p-4 sm:p-5 transition-all cursor-grab active:cursor-grabbing select-none relative group bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/50"
                      >
                        {/* Drag handle */}
                        <div className="absolute top-3.5 right-3.5 transition-colors" style={{ color: "rgba(0,0,0,0.2)" }}>
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Title + Amount */}
                        <div className="space-y-1 pr-6">
                          <h4
                            className="font-display-serif text-base sm:text-lg leading-snug text-[#171717]"
                          >
                            {grant.title}
                          </h4>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-xs font-mono font-bold text-[#171717]"
                            >
                              {grant.amount}
                            </span>
                            <span
                              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full urgency-${deadline.urgency}`}
                            >
                              {deadline.label}
                            </span>
                          </div>
                          <div
                            className="text-[10px] font-mono uppercase tracking-wider text-[#171717]/50"
                          >
                            {grant.organization}
                          </div>
                        </div>

                        {/* Submitted: show expected response date and next steps */}
                        {col.id === "submitted" && (
                          <div className="mt-3 space-y-2 p-2.5 rounded-lg bg-[#F8F9FA] border border-emerald-500/10">
                            {grant.expectedResponseDate && (
                              <div
                                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
                                style={{ color: "var(--ink-faint)" }}
                              >
                                <Calendar className="w-3 h-3 text-emerald-600" />
                                <span>
                                  Decision Expected:{" "}
                                  <strong style={{ color: "var(--ink)" }}>
                                    {new Date(grant.expectedResponseDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </strong>
                                </span>
                              </div>
                            )}
                            <p className="text-[11px] leading-relaxed text-black/60 italic">
                              What happens next: Applications undergo holistic review. Selection committee notifies finalists via email.
                            </p>
                          </div>
                        )}

                        {/* Controls */}
                        <div
                          className="flex items-center justify-between pt-3 mt-3"
                          style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
                        >
                          {/* Left: back navigation */}
                          <div>
                            {col.id === "in_progress" && (
                              <button
                                type="button"
                                onClick={() => onMoveItem(grant.id, "saved")}
                                className="min-h-[44px] px-2 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors"
                                style={{ color: "var(--ink-faint)" }}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back
                              </button>
                            )}
                            {col.id === "submitted" && (
                              <button
                                type="button"
                                onClick={() => onMoveItem(grant.id, "in_progress")}
                                className="min-h-[44px] px-2 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors"
                                style={{ color: "var(--ink-faint)" }}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Re-open
                              </button>
                            )}
                          </div>

                          {/* Right: actions */}
                          <div className="flex items-center gap-2">
                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => onOpenDetail(grant)}
                              className="min-h-[42px] min-w-[42px] px-3 flex items-center justify-center gap-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all bg-white hover:bg-neutral-100 text-[#18181B] border border-black/15 shadow-sm cursor-pointer"
                              title="View full details"
                            >
                              <Info className="w-4 h-4 text-[#18181B]" />
                            </button>

                            {/* Apply external link */}
                            <a
                              href={grant.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[42px] min-w-[42px] px-3 flex items-center justify-center rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all bg-white hover:bg-neutral-100 text-[#18181B] border border-black/15 shadow-sm cursor-pointer"
                              title="Open application"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4 text-[#18181B]" />
                            </a>

                            {/* Stage-specific actions */}
                            {col.id === "saved" && (
                              <button
                                type="button"
                                onClick={() => onMoveItem(grant.id, "in_progress")}
                                className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-white bg-[#18181B] hover:bg-[#FF3366] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <span>Start Draft</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {col.id === "in_progress" && (
                              <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleFinalSubmit(grant.id)}
                                className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-white btn-primary flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Submitting…</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Submit</span>
                                    <Send className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            )}

                            {col.id === "submitted" && (
                              <span
                                className="min-h-[44px] flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-medium"
                                style={{ color: "#059669" }}
                              >
                                <Check className="w-4 h-4" />
                                Submitted
                              </span>
                            )}

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => onRemoveItem(grant.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                              style={{ color: "rgba(0,0,0,0.2)" }}
                              title="Remove from board"
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.2)")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty state */}
                {items.length === 0 && (
                  <div
                    className="py-8 px-4 rounded-xl flex flex-col items-center justify-center text-center space-y-1"
                    style={{ background: "rgba(234,235,239,0.6)" }}
                  >
                    <span
                      className="text-xs font-mono uppercase tracking-wider font-medium"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {col.id === "saved"
                        ? "Save scholarships from the discovery feed"
                        : col.id === "in_progress"
                        ? "Move a saved scholarship here when you start applying"
                        : "Mark applications as submitted when done"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p
        className="text-center text-[11px] font-mono uppercase tracking-wider py-2"
        style={{ color: "var(--ink-faint)" }}
      >
        Drag cards between columns to update your status
      </p>
    </div>
  );
}
