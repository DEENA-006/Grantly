"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Scholarship, AwardType } from "@/data/mockData";

interface AddCustomScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScholarship: (scholarship: Scholarship) => void;
}

export function AddCustomScholarshipModal({
  isOpen,
  onClose,
  onAddScholarship,
}: AddCustomScholarshipModalProps) {
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

  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [amount, setAmount] = useState("$2,500");
  const [awardType, setAwardType] = useState<AwardType>("One-Time");
  const [deadline, setDeadline] = useState("2027-01-15");
  const [applicationUrl, setApplicationUrl] = useState("https://");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 1000;

    const newScholarship: Scholarship = {
      id: `custom_${Date.now()}`,
      title,
      organization,
      amount: amount.startsWith("$") ? amount : `$${amount}`,
      amountNumeric: numericAmount,
      amountNote: awardType === "Renewable" ? "per year, renewable" : "one-time award",
      deadline,
      openDate: "2026-11-01",
      tags: ["Custom", "Local", "Financial Aid"],
      matchScore: 95,
      whyMatched: "Custom scholarship tracked by candidate.",
      eligibility: "Student-defined external opportunity",
      recipientCount: 1,
      awardType,
      documentsRequired: ["Personal Statement", "Proof of Enrollment"],
      applicationUrl: applicationUrl.startsWith("http") ? applicationUrl : `https://${applicationUrl}`,
      essayPrompts: [],
      expectedResponseDate: "2027-03-01",
      description: notes || `External scholarship from ${organization}.`,
    };

    onAddScholarship(newScholarship);
    onClose();

    // Reset fields
    setTitle("");
    setOrganization("");
    setAmount("$2,500");
    setNotes("");
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain"
            style={{ color: "var(--ink)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: "var(--ink)" }}
                >
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display-serif text-2xl leading-none">
                    Track Custom Scholarship
                  </h3>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-black/50 mt-1">
                    Add external or local financial aid opportunities
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-black/40 hover:text-black hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotary Club STEM Grant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Organization / Provider *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotary International District 3232"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Award Amount
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Award Type
                  </label>
                  <select
                    value={awardType}
                    onChange={(e) => setAwardType(e.target.value as AwardType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors bg-white cursor-pointer"
                  >
                    <option value="One-Time">One-Time</option>
                    <option value="Renewable">Renewable</option>
                    <option value="Monthly Stipend">Monthly Stipend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Application URL
                  </label>
                  <input
                    type="text"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Notes / Eligibility Summary
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key instructions, essay prompts, or contact person..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-black/60 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white shadow-md flex items-center gap-2 transition-all hover:opacity-90"
                  style={{ background: "var(--accent)" }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Tracker</span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
