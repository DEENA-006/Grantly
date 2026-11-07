"use client";

import { useState } from "react";
import { UserProfile } from "@/data/mockData";
import { soundFx } from "@/utils/soundEffects";
import { HelpCircle, Volume2, VolumeX, Sliders } from "lucide-react";

interface StudentHeaderProps {
  user: UserProfile;
  onOpenProfileModal: () => void;
  onOpenOnboarding: () => void;
}

export function StudentHeader({
  user,
  onOpenProfileModal,
  onOpenOnboarding,
}: StudentHeaderProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(soundFx.enabled);

  const toggleSound = () => {
    const next = soundFx.toggle();
    setIsAudioEnabled(next);
  };

  const initialLetter = user.name.charAt(0) || "S";

  return (
    <header
      className="pt-6 pb-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span
          className="font-display-serif text-2xl font-semibold tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Grantly<span style={{ color: "var(--accent)" }}>.</span>
        </span>
        <span
          className="hidden sm:inline text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,51,102,0.08)", color: "var(--accent)" }}
        >
          Scholarship Finder
        </span>
      </div>

      {/* Nav Actions & Student Profile Pill */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* How It Works Button */}
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-black/60 hover:text-black hover:bg-black/5 transition-colors flex items-center gap-1.5"
          title="Learn how Grantly works"
        >
          <HelpCircle className="w-3.5 h-3.5 text-black/40" />
          <span className="hidden sm:inline">How it works</span>
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center ${
            isAudioEnabled
              ? "bg-emerald-50 text-emerald-700"
              : "text-black/40 hover:text-black hover:bg-black/5"
          }`}
          title={isAudioEnabled ? "Sound enabled (click to mute)" : "Sound muted (click to enable)"}
        >
          {isAudioEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Interactive Student Profile Pill */}
        <button
          type="button"
          onClick={onOpenProfileModal}
          className="group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all hover:shadow-md cursor-pointer text-left"
          style={{ background: "#F3F4F6" }}
          title="Click to edit profile, GPA & major"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ background: "var(--ink)" }}
          >
            {initialLetter}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold leading-none" style={{ color: "var(--ink)" }}>
                {user.name}
              </span>
              <span className="text-[10px] font-mono text-black/40 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex items-center gap-0.5">
                <Sliders className="w-2.5 h-2.5" />
                Edit
              </span>
            </div>
            <div
              className="text-[10px] mt-0.5 font-mono uppercase tracking-wider"
              style={{ color: "var(--ink-muted)" }}
            >
              {user.major.length > 18 ? user.major.slice(0, 16) + "…" : user.major} · GPA {user.gpa.toFixed(2)}
            </div>
          </div>
        </button>

        {/* Institution Badge */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider"
          style={{ color: "var(--ink-faint)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {user.university}
        </div>
      </div>
    </header>
  );
}

