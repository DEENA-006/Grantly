"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  CheckSquare,
  Square,
  ArrowRight,
  Calendar,
  Users,
  RefreshCw,
  Clock,
  CalendarPlus,
} from "lucide-react";
import { getGoogleCalendarUrl, downloadIcsFile } from "@/utils/calendar";
import {
  Scholarship,
  BoardItem,
  BoardStatus,
  getDeadlineLabel,
  ChecklistItem,
} from "@/data/mockData";

interface Props {
  grant: Scholarship | null;
  isOpen: boolean;
  boardItem: BoardItem | null;
  onClose: () => void;
  onSave: (grantId: string) => void;
  onMove: (grantId: string, toStatus: BoardStatus) => void;
  onUpdateBoardItem: (grantId: string, updates: Partial<BoardItem>) => void;
}

const AWARD_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  "One-Time": { bg: "#EEF2FF", color: "#4338CA" },
  "Renewable": { bg: "#ECFDF5", color: "#059669" },
  "Monthly Stipend": { bg: "#FFF7ED", color: "#C2410C" },
};

export function ApplicationDetailModal({
  grant,
  isOpen,
  boardItem,
  onClose,
  onSave,
  onMove,
  onUpdateBoardItem,
}: Props) {
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([]);
  const [localNotes, setLocalNotes] = useState("");

  // Sync local state when grant/boardItem changes
  useEffect(() => {
    if (!grant) return;
    if (boardItem) {
      // Build checklist from board item checklist OR from grant docs if empty
      if (boardItem.checklist && boardItem.checklist.length > 0) {
        setLocalChecklist(boardItem.checklist);
      } else {
        setLocalChecklist(
          grant.documentsRequired.map((doc, i) => ({
            id: `doc_${i}`,
            label: doc,
            done: false,
          }))
        );
      }
      setLocalNotes(boardItem.notes || "");
    } else {
      // Not saved yet — show docs list as preview
      setLocalChecklist(
        grant.documentsRequired.map((doc, i) => ({
          id: `doc_${i}`,
          label: doc,
          done: false,
        }))
      );
      setLocalNotes("");
    }
  }, [grant, boardItem]);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Save checklist + notes changes
  const saveChanges = (newChecklist: ChecklistItem[], newNotes: string) => {
    if (!grant || !boardItem) return;
    onUpdateBoardItem(grant.id, { checklist: newChecklist, notes: newNotes });
  };

  const toggleChecklistItem = (id: string) => {
    const updated = localChecklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setLocalChecklist(updated);
    saveChanges(updated, localNotes);
  };

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    saveChanges(localChecklist, value);
  };

  if (!grant) return null;

  const deadline = getDeadlineLabel(grant.deadline);
  const awardStyle = AWARD_TYPE_STYLES[grant.awardType] ?? { bg: "#F3F4F6", color: "#52525B" };
  const isSaved = !!boardItem;
  const status = boardItem?.status;

  const completedDocs = localChecklist.filter((c) => c.done).length;
  const totalDocs = localChecklist.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-lg overflow-y-auto overscroll-contain shadow-2xl flex flex-col"
            style={{ background: "var(--canvas)" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 px-6 py-5 border-b flex items-start justify-between gap-4" style={{ background: "var(--canvas)", borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: awardStyle.bg, color: awardStyle.color }}
                  >
                    {grant.awardType}
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full urgency-${deadline.urgency}`}>
                    {deadline.label}
                  </span>
                  {isSaved && (
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(255,51,102,0.08)", color: "var(--accent)" }}
                    >
                      {status === "submitted" ? "Submitted" : status === "in_progress" ? "In Progress" : "Saved"}
                    </span>
                  )}
                </div>
                <h2
                  className="font-display-serif text-2xl sm:text-3xl leading-tight tracking-tight"
                  style={{ color: "var(--ink)" }}
                >
                  {grant.title}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
                  {grant.organization}
                </p>
              </div>
              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                style={{ color: "var(--ink-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-6 space-y-8">

              {/* Amount + Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ background: "var(--ink)", color: "#FAFAFA" }}>
                  <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Award Amount</div>
                  <div className="font-display-serif text-3xl font-normal">{grant.amount}</div>
                  <div className="text-[10px] font-mono opacity-50 mt-1">{grant.amountNote}</div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: "#F3F4F6" }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-faint)" }}>Recipients / Year</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                      <Users className="w-3.5 h-3.5" style={{ color: "var(--ink-faint)" }} />
                      {grant.recipientCount} students
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "#F3F4F6" }}>
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-faint)" }}>Response Expected</div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--ink)" }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: "var(--ink-faint)" }} />
                      {new Date(grant.expectedResponseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline & Calendar Sync */}
              <div className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: "#F3F4F6" }}>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: "var(--ink-faint)" }}>
                    Application Deadline
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                      {new Date(grant.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full urgency-${deadline.urgency}`}>
                      {deadline.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getGoogleCalendarUrl(grant.title, grant.deadline, grant.organization, grant.applicationUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors bg-white hover:bg-neutral-100 shadow-sm"
                    style={{ color: "var(--ink)" }}
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Cal</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(grant.title, grant.deadline, grant.organization, grant.applicationUrl)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors bg-white hover:bg-neutral-100 shadow-sm"
                    style={{ color: "var(--ink-muted)" }}
                    title="Download iCal (.ics) file"
                  >
                    <span>.iCal</span>
                  </button>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>About this scholarship</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{grant.description}</p>
              </div>

              {/* Why Matched */}
              <div className="p-4 rounded-2xl" style={{ background: "rgba(255,51,102,0.05)" }}>
                <h3 className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                  ✓ Why you matched
                </h3>
                <p className="text-sm leading-relaxed italic" style={{ color: "var(--ink-muted)" }}>{grant.whyMatched}</p>
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>Eligibility requirements</h3>
                <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{grant.eligibility}</p>
              </div>

              {/* Document Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                    Documents required
                  </h3>
                  {isSaved && (
                    <span className="text-[10px] font-mono uppercase tracking-wider font-medium" style={{ color: "var(--accent)" }}>
                      {completedDocs}/{totalDocs} ready
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {isSaved && totalDocs > 0 && (
                  <div className="h-1 w-full rounded-full mb-4" style={{ background: "#E4E4E7" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(completedDocs / totalDocs) * 100}%`, background: "var(--accent)" }}
                    />
                  </div>
                )}
                <div className="space-y-2.5">
                  {localChecklist.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!isSaved}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="w-full flex items-start gap-3 text-left min-h-[44px] py-1 group transition-opacity disabled:cursor-default"
                    >
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0 transition-colors" style={{ color: "var(--accent)" }} />
                      ) : (
                        <Square className="w-4 h-4 mt-0.5 flex-shrink-0 transition-colors" style={{ color: isSaved ? "var(--ink-faint)" : "var(--ink-faint)" }} />
                      )}
                      <span
                        className="text-sm transition-colors"
                        style={{
                          color: item.done ? "var(--ink-faint)" : "var(--ink-muted)",
                          textDecoration: item.done ? "line-through" : "none",
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                {!isSaved && (
                  <p className="mt-2 text-[11px] font-mono" style={{ color: "var(--ink-faint)" }}>
                    Save this scholarship to track your document progress.
                  </p>
                )}
              </div>

              {/* Essay Prompts */}
              {grant.essayPrompts.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--ink-faint)" }}>Essay prompts</h3>
                  <div className="space-y-3">
                    {grant.essayPrompts.map((prompt, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl text-sm leading-relaxed italic"
                        style={{ background: "#F3F4F6", color: "var(--ink-muted)", borderLeft: "3px solid var(--accent)" }}
                      >
                        &ldquo;{prompt}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes (only if saved) */}
              {isSaved && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--ink-faint)" }}>My notes</h3>
                  <textarea
                    value={localNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Add your personal notes about this application…"
                    rows={4}
                    className="w-full p-3 rounded-xl text-sm resize-none outline-none transition-colors"
                    style={{
                      background: "#F3F4F6",
                      color: "var(--ink)",
                      border: "1.5px solid transparent",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  />
                </div>
              )}
            </div>

            {/* Sticky Footer Actions */}
            <div
              className="sticky bottom-0 px-6 py-5 space-y-3 border-t"
              style={{ background: "var(--canvas)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              {/* Primary: Apply on website */}
              <a
                href={grant.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full min-h-[50px] rounded-xl text-sm font-mono uppercase tracking-wider font-semibold transition-opacity hover:opacity-90 text-white"
                style={{ background: "var(--ink)" }}
              >
                <ExternalLink className="w-4 h-4" />
                Start Application on Website
              </a>

              {/* Secondary: Save / Progress actions */}
              {!isSaved ? (
                <button
                  type="button"
                  onClick={() => { onSave(grant.id); }}
                  className="flex items-center justify-center gap-2 w-full min-h-[46px] rounded-xl text-sm font-mono uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,51,102,0.08)", color: "var(--accent)" }}
                >
                  Save to My Tracker
                </button>
              ) : status === "saved" ? (
                <button
                  type="button"
                  onClick={() => { onMove(grant.id, "in_progress"); onClose(); }}
                  className="flex items-center justify-center gap-2 w-full min-h-[46px] rounded-xl text-sm font-mono uppercase tracking-wider font-medium transition-colors text-white"
                  style={{ background: "var(--accent)" }}
                >
                  <span>Mark as In Progress</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : status === "in_progress" ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { onMove(grant.id, "saved"); onClose(); }}
                    className="flex-1 min-h-[46px] rounded-xl text-sm font-mono uppercase tracking-wider font-medium transition-colors"
                    style={{ background: "#F3F4F6", color: "var(--ink-muted)" }}
                  >
                    <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                    Back to Saved
                  </button>
                  <button
                    type="button"
                    onClick={() => { onMove(grant.id, "submitted"); onClose(); }}
                    className="flex-1 min-h-[46px] rounded-xl text-sm font-mono uppercase tracking-wider font-semibold transition-colors text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    Mark Submitted
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full min-h-[46px] rounded-xl text-sm font-mono uppercase tracking-wider" style={{ background: "#ECFDF5", color: "#059669" }}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Application Submitted — Awaiting Response
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
