"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, User, Sparkles } from "lucide-react";
import { UserProfile } from "@/data/mockData";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updatedUser: UserProfile) => void;
}

const AVAILABLE_INTERESTS = [
  "AI/ML",
  "Open Source",
  "Systems",
  "Research",
  "Ethics",
  "Robotics",
  "Cloud",
  "Security",
  "Web3",
  "Design",
];

const MAJOR_OPTIONS = [
  "Computer Science",
  "Software Engineering",
  "Data Science",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Biotechnology",
  "Information Technology",
];

export function StudentProfileModal({
  isOpen,
  onClose,
  user,
  onSaveUser,
}: StudentProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [major, setMajor] = useState(user.major);
  const [year, setYear] = useState<UserProfile["year"]>(user.year);
  const [gpa, setGpa] = useState(user.gpa);
  const [university, setUniversity] = useState(user.university);
  const [interests, setInterests] = useState<string[]>(user.interests);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setMajor(user.major);
      setYear(user.year);
      setGpa(user.gpa);
      setUniversity(user.university);
      setInterests(user.interests);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, user]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    const firstName = name.split(" ")[0] || "Student";
    onSaveUser({
      name,
      firstName,
      major,
      year,
      gpa: parseFloat(gpa.toString()),
      university,
      interests,
    });
    onClose();
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
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto overscroll-contain"
            style={{ color: "var(--ink)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: "var(--ink)" }}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display-serif text-xl sm:text-2xl leading-none">
                    Edit Student Profile
                  </h3>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-black/50 mt-1">
                    Live match scores update automatically
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

            {/* Form Fields */}
            <div className="space-y-5 text-sm">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                />
              </div>

              {/* Major & Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Discipline / Major
                  </label>
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors bg-white cursor-pointer"
                  >
                    {MAJOR_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors bg-white cursor-pointer"
                  >
                    {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GPA Slider & Input */}
              <div className="space-y-2 p-4 rounded-xl bg-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                    Grade Point Average (GPA)
                  </label>
                  <span className="font-mono text-base font-semibold text-[#18181B]">
                    {Number(gpa).toFixed(2)} / 10.0
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.05"
                  value={gpa}
                  onChange={(e) => setGpa(parseFloat(e.target.value))}
                  className="w-full accent-[#FF3366] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-black/40">
                  <span>6.0</span>
                  <span>7.5</span>
                  <span>8.5 (Common Cutoff)</span>
                  <span>10.0</span>
                </div>
              </div>

              {/* University */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Institution
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-black outline-none font-medium transition-colors"
                />
              </div>

              {/* Interests Tags */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-black/50 block">
                  Areas of Focus & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#18181B] text-white font-medium shadow-sm"
                            : "bg-[#F3F4F6] text-black/60 hover:text-black"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-black/60 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="min-h-[44px] px-6 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white shadow-md flex items-center gap-2 transition-all hover:opacity-90"
                style={{ background: "var(--accent)" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save & Recalculate</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
