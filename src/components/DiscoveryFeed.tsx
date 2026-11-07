"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  ArrowUpRight,
  ExternalLink,
  Scale,
} from "lucide-react";
import { Scholarship, BoardItem, getDeadlineLabel } from "@/data/mockData";

interface DiscoveryFeedProps {
  scholarships: Scholarship[];
  boardItems: BoardItem[];
  isLoading: boolean;
  onSaveGrant: (grantId: string) => void;
  onOpenDetail: (grant: Scholarship) => void;
  onOpenCompare?: (grants: Scholarship[]) => void;
}

const AWARD_TYPE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  "One-Time": { bg: "#EEF2FF", color: "#3730A3", border: "#C7D2FE" },
  "Renewable": { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
  "Monthly Stipend": { bg: "#FFF7ED", color: "#9A3412", border: "#FED7AA" },
};

export function DiscoveryFeed({
  scholarships,
  boardItems,
  isLoading,
  onSaveGrant,
  onOpenDetail,
  onOpenCompare,
}: DiscoveryFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"match" | "amount" | "deadline">("match");
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isGrantInBoard = (grantId: string) =>
    boardItems.some((item) => item.grantId === grantId);

  const getGrantStatus = (grantId: string) => {
    const item = boardItems.find((b) => b.grantId === grantId);
    return item ? item.status : null;
  };

  const handleSaveClick = (grantId: string) => {
    onSaveGrant(grantId);
    setJustSavedId(grantId);
    setTimeout(() => setJustSavedId(null), 1800);
  };

  const toggleCompare = (grantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(grantId)) return prev.filter((id) => id !== grantId);
      if (prev.length >= 3) return [prev[1], prev[2], grantId];
      return [...prev, grantId];
    });
  };

  const filteredScholarships = useMemo(() => {
    return scholarships
      .filter((grant) => {
        if (activeFilter === "TECH" && !grant.tags.includes("CS")) return false;
        if (activeFilter === "MERIT" && !grant.tags.includes("Merit")) return false;
        if (activeFilter === "INNOVATION" && !grant.tags.includes("Innovation")) return false;
        if (activeFilter === "DIVERSITY" && !grant.tags.includes("Diversity")) return false;

        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          return (
            grant.title.toLowerCase().includes(q) ||
            grant.organization.toLowerCase().includes(q) ||
            grant.tags.some((t) => t.toLowerCase().includes(q)) ||
            grant.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "amount") return b.amountNumeric - a.amountNumeric;
        if (sortBy === "deadline") return a.deadline.localeCompare(b.deadline);
        return b.matchScore - a.matchScore;
      });
  }, [scholarships, debouncedSearch, activeFilter, sortBy]);

  return (
    <div className="relative space-y-8 sm:space-y-10 w-full">
      {/* Ambient background glow to make frosted glass pop */}
      <div className="ambient-glow-pink -top-20 -left-20" />
      <div className="ambient-glow-peach top-1/2 -right-20" />

      {/* Feed Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-black/[0.06]">
        <div>
          <span
            className="text-xs font-mono uppercase tracking-widest font-bold block mb-1 text-[#FF3366]"
          >
            Personalized Opportunities
          </span>
          <h2
            className="font-display-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#18181B]"
          >
            Matched Opportunities
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#18181B]/60">
          <span>Displaying</span>
          <span
            className="font-bold px-3 py-1 rounded-full text-xs bg-white border border-black/10 text-[#18181B] shadow-sm"
          >
            {isLoading ? "—" : filteredScholarships.length} Available
          </span>
        </div>
      </div>

      {/* Search + Category Filter Bar */}
      <div className="relative z-10 space-y-5 p-6 rounded-2xl glass-card">
        {/* Search input with bold icon and clear button */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-3 text-black/50 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scholarship name, field of study, or keyword…"
            className="w-full pl-11 pr-24 py-3.5 rounded-xl border-2 border-black/10 focus:border-[#18181B] bg-white/90 text-sm font-medium outline-none transition-all shadow-inner text-[#18181B] placeholder:text-black/40"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-xs font-mono uppercase font-bold text-black transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills + Sort Selector (All clearly visible buttons) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black/60 mr-1 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Category:
            </span>
            {[
              { id: "ALL", label: "All Opportunities" },
              { id: "TECH", label: "Tech & CS" },
              { id: "MERIT", label: "Merit Based" },
              { id: "INNOVATION", label: "Innovation" },
              { id: "DIVERSITY", label: "Diversity & STEM" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer ${
                  activeFilter === f.id
                    ? "bg-[#18181B] text-white border-2 border-[#18181B]"
                    : "bg-white hover:bg-neutral-100 text-[#18181B] border-2 border-black/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Selector with clear border */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#18181B]">
            <ArrowUpDown className="w-4 h-4 text-[#FF3366]" />
            <span className="font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match" | "amount" | "deadline")}
              className="bg-white px-3 py-2 rounded-xl border-2 border-black/10 text-xs font-mono uppercase font-bold outline-none cursor-pointer focus:border-[#18181B] shadow-sm text-[#18181B]"
            >
              <option value="match">Highest Match Score</option>
              <option value="amount">Highest Award Amount</option>
              <option value="deadline">Soonest Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── SCHOLARSHIP CARDS (FULL WIDTH, GLASSMORPHIC & ACCESSIBLE) ── */}
      <div className="relative z-10 space-y-6 pt-1">
        {isLoading ? (
          <div className="space-y-6 py-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 rounded-3xl space-y-5 glass-card"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-44 bg-black/10 rounded-full animate-pulse" />
                  <div className="h-4 w-28 bg-black/10 rounded-full animate-pulse" />
                </div>
                <div className="h-10 w-80 bg-black/10 rounded-xl animate-pulse" />
                <div className="h-4 w-full bg-black/10 rounded-md animate-pulse" />
                <div className="h-4 w-4/5 bg-black/10 rounded-md animate-pulse" />
                <div className="flex justify-between pt-3">
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-black/10 rounded-full animate-pulse" />
                    <div className="h-8 w-24 bg-black/10 rounded-full animate-pulse" />
                  </div>
                  <div className="h-11 w-36 bg-black/10 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl glass-card p-10">
            <p className="font-display-serif text-3xl text-[#18181B]">No matching scholarships found</p>
            <p className="text-sm text-black/60 max-w-md mx-auto">
              We couldn&apos;t find any scholarships matching your search criteria. Try clearing filters or searching for another keyword.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveFilter("ALL"); }}
              className="min-h-[46px] px-6 py-2.5 rounded-xl text-xs font-mono uppercase font-bold text-white btn-primary cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          filteredScholarships.map((grant) => {
            const inBoard = isGrantInBoard(grant.id);
            const status = getGrantStatus(grant.id);
            const isJustSaved = justSavedId === grant.id;
            const deadline = getDeadlineLabel(grant.deadline);
            const awardStyle = AWARD_TYPE_STYLES[grant.awardType] ?? { bg: "#F3F4F6", color: "#18181B", border: "#E4E4E7" };
            const isComparing = compareIds.includes(grant.id);

            const saveLabel = isJustSaved
              ? "Saved to Board ✓"
              : inBoard
              ? status === "submitted"
                ? "Submitted ✓"
                : status === "in_progress"
                ? "In Progress"
                : "Saved in Board"
              : "Save to Tracker";

            return (
              <article
                key={grant.id}
                onClick={() => onOpenDetail(grant)}
                className="relative p-7 sm:p-9 rounded-3xl space-y-5 cursor-pointer glass-card group overflow-hidden"
              >
                {/* Top Meta Line: Organization, Award Type Pill, Compare Button, Deadline Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#18181B]">
                      {grant.organization}
                    </span>
                    <span
                      className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-sm"
                      style={{ background: awardStyle.bg, color: awardStyle.color, border: `1px solid ${awardStyle.border}` }}
                    >
                      {grant.awardType}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleCompare(grant.id, e)}
                      className={`min-h-[32px] px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        isComparing
                          ? "bg-[#18181B] text-white border border-[#18181B]"
                          : "bg-white hover:bg-neutral-100 text-[#18181B] border border-black/15"
                      }`}
                      title="Compare side-by-side"
                    >
                      <Scale className="w-3.5 h-3.5 text-[#FF3366]" />
                      <span>{isComparing ? "Selected" : "Compare"}</span>
                    </button>
                  </div>

                  {/* High-visibility deadline countdown badge */}
                  <span
                    className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full font-bold shadow-sm urgency-${deadline.urgency}`}
                  >
                    ⏰ {deadline.label}
                  </span>
                </div>

                {/* Title + Amount */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <h3
                    className="font-display-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#18181B] group-hover:text-[#FF3366] transition-colors leading-tight"
                  >
                    {grant.title}
                  </h3>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
                      {grant.amount}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider mt-0.5 text-black/50 font-medium">
                      {grant.amountNote}
                    </div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/70 font-semibold bg-white/60 p-2.5 rounded-xl border border-white/90">
                  <span className="text-[#FF3366]">✦</span>
                  <span>Eligibility: {grant.eligibility}</span>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base leading-relaxed text-[#18181B]/85 font-sans">
                  {grant.description}
                </p>

                {/* Why Matched Rationale Box */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/80 border border-white/95 shadow-sm">
                  <span className="text-base font-bold text-[#FF3366] mt-0.5">✓</span>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF3366] block mb-0.5">
                      Why You Matched ({grant.matchScore}% Match Score)
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed italic text-[#18181B]/80 font-sans">
                      {grant.whyMatched}
                    </p>
                  </div>
                </div>

                {/* Micro Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider text-black/60">
                  <span>Awarded to <strong className="text-[#18181B] font-bold">{grant.recipientCount}</strong> students/year</span>
                  <span>•</span>
                  <span>Match Rating <strong className="text-emerald-700 font-bold">{grant.matchScore}%</strong></span>
                  <span>•</span>
                  <span>Docs: <strong className="text-[#18181B] font-bold">{grant.documentsRequired.length} Items</strong></span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {grant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/80 border border-black/10 text-[#18181B] font-semibold hover:border-[#FF3366] hover:text-[#FF3366] transition-colors shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: High-Contrast, Fully Visible & Tactile */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.06]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Secondary Action: Apply on Official Website */}
                  <a
                    href={grant.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[46px] px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 btn-secondary cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-[#18181B]" />
                    <span>Apply on Portal</span>
                  </a>

                  {/* Primary Action: Save to Tracker / View Status */}
                  <button
                    type="button"
                    onClick={() => handleSaveClick(grant.id)}
                    disabled={inBoard && !isJustSaved}
                    className={`min-h-[46px] px-7 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      isJustSaved
                        ? "bg-[#059669] text-white shadow-[#059669]/30"
                        : inBoard
                        ? "bg-[#18181B] text-white opacity-90 cursor-default"
                        : "btn-primary"
                    }`}
                  >
                    {(isJustSaved || inBoard) && <Check className="w-4 h-4 text-white" />}
                    {!isJustSaved && !inBoard && <ArrowUpRight className="w-4 h-4" />}
                    <span>{saveLabel}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Floating Bottom Comparison Pill (When 2+ selected) */}
      {compareIds.length >= 2 && onOpenCompare && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={() => {
              const selected = scholarships.filter((s) => compareIds.includes(s.id));
              onOpenCompare(selected);
            }}
            className="px-6 py-3.5 rounded-full bg-[#18181B] text-white shadow-2xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all border-2 border-white/50 cursor-pointer"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Compare ({compareIds.length}) Scholarships Side-by-Side →</span>
          </button>
        </div>
      )}
    </div>
  );
}
