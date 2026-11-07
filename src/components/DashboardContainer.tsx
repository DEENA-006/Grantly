"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DiscoveryFeed } from "./DiscoveryFeed";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { FinancialSummary } from "./FinancialSummary";
import {
  Scholarship,
  BoardItem,
  BoardStatus,
  initialScholarships,
  initialBoardItems,
} from "@/data/mockData";
import { soundFx } from "@/utils/soundEffects";
import { LayoutGrid, Sparkles, X, ArrowRight } from "lucide-react";

interface DashboardContainerProps {
  initialScholarshipsProp?: Scholarship[];
  onOpenCompare?: (grants: Scholarship[]) => void;
}

export function DashboardContainer({
  initialScholarshipsProp,
  onOpenCompare,
}: DashboardContainerProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(
    initialScholarshipsProp || initialScholarships
  );
  const [boardItems, setBoardItems] = useState<BoardItem[]>(initialBoardItems);
  const [isLoading, setIsLoading] = useState(true);
  const [detailGrant, setDetailGrant] = useState<Scholarship | null>(null);
  const [showHelperBanner, setShowHelperBanner] = useState(true);

  // Sync when prop updates (e.g. from Profile recalculations)
  useEffect(() => {
    if (initialScholarshipsProp) {
      setScholarships(initialScholarshipsProp);
    }
  }, [initialScholarshipsProp]);

  // Load board from localStorage on mount & initial fetch
  useEffect(() => {
    try {
      const savedBoard = localStorage.getItem("grantly_board_items");
      if (savedBoard) {
        setBoardItems(JSON.parse(savedBoard));
      }
      const dismissedBanner = localStorage.getItem("grantly_banner_dismissed");
      if (dismissedBanner) {
        setShowHelperBanner(false);
      }
    } catch {
      // Ignore
    }

    const fetchGrants = async () => {
      try {
        const res = await fetch("/api/grants");
        if (res.ok) {
          const data = await res.json();
          if (!initialScholarshipsProp && data.scholarships) {
            setScholarships(data.scholarships);
          }
        }
      } catch {
        // Fallback to initial
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrants();
  }, [initialScholarshipsProp]);

  // Save boardItems to localStorage on change
  const persistBoard = (items: BoardItem[]) => {
    setBoardItems(items);
    try {
      localStorage.setItem("grantly_board_items", JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  // Board actions
  const handleSaveGrant = (grantId: string) => {
    if (boardItems.some((b) => b.grantId === grantId)) return;
    const newItem: BoardItem = {
      grantId,
      status: "saved",
      updatedAt: new Date().toISOString(),
      notes: "",
      checklist: [],
    };
    const updated = [newItem, ...boardItems];
    persistBoard(updated);
    soundFx.playSave();

    fetch("/api/board/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grantId, status: "saved" }),
    }).catch(() => {});
  };

  const handleMoveItem = (grantId: string, toStatus: BoardStatus) => {
    let updated: BoardItem[];
    const exists = boardItems.some((item) => item.grantId === grantId);
    if (!exists) {
      updated = [
        { grantId, status: toStatus, updatedAt: new Date().toISOString(), notes: "", checklist: [] },
        ...boardItems,
      ];
    } else {
      updated = boardItems.map((item) =>
        item.grantId === grantId
          ? { ...item, status: toStatus, updatedAt: new Date().toISOString() }
          : item
      );
    }
    persistBoard(updated);

    if (toStatus === "submitted") {
      soundFx.playSuccess();
    } else {
      soundFx.playSave();
    }

    fetch("/api/board/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grantId, status: toStatus }),
    }).catch(() => {});
  };

  const handleUpdateBoardItem = (grantId: string, updates: Partial<BoardItem>) => {
    const updated = boardItems.map((item) =>
      item.grantId === grantId ? { ...item, ...updates } : item
    );
    persistBoard(updated);
  };

  const handleOpenDetail = (grant: Scholarship) => {
    setDetailGrant(grant);
  };

  const dismissBanner = () => {
    setShowHelperBanner(false);
    try {
      localStorage.setItem("grantly_banner_dismissed", "true");
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative pt-6 sm:pt-10 pb-32 w-full space-y-10">
      {/* Onboarding Helper Banner */}
      {showHelperBanner && (
        <div className="p-5 sm:p-6 rounded-3xl glass-card flex flex-col sm:flex-row items-start justify-between gap-4 border-l-4 border-[#FF3366]">
          <div className="flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-[#FF3366] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-base sm:text-lg text-[#18181B]">
                Welcome to your Personalized Scholarship Discovery Feed
              </h4>
              <p className="text-xs sm:text-sm text-black/70 leading-relaxed max-w-3xl font-sans">
                Explore matched scholarships below with detailed match explanations. Click <strong>&ldquo;Save to Tracker&rdquo;</strong> to organize your requirements, checklist items, and deadlines into your dedicated Application Tracker.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <Link
              href="/tracker"
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold text-[#18181B] bg-white border border-black/15 shadow-sm hover:border-black flex items-center gap-1.5 transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#FF3366]" />
              <span>Go to Board ({boardItems.length})</span>
            </Link>
            <button
              type="button"
              onClick={dismissBanner}
              className="p-2 text-black/40 hover:text-black rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Financial Summary Strip */}
      {!isLoading && boardItems.length > 0 && (
        <FinancialSummary boardItems={boardItems} scholarships={scholarships} />
      )}

      {/* ── EXPANSIVE FULL-WIDTH DISCOVERY FEED (NO KANBAN BOARD SQUISHING) ── */}
      <div className="w-full">
        <DiscoveryFeed
          scholarships={scholarships}
          boardItems={boardItems}
          isLoading={isLoading}
          onSaveGrant={handleSaveGrant}
          onOpenDetail={handleOpenDetail}
          onOpenCompare={onOpenCompare}
        />
      </div>

      {/* Dedicated Application Tracker CTA Banner at bottom */}
      <div className="p-7 sm:p-8 rounded-3xl bg-[#18181B] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF3366] font-bold">
            Application Board
          </span>
          <h3 className="font-display-serif text-2xl sm:text-3xl font-normal">
            Ready to track your submissions?
          </h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg font-sans">
            You have {boardItems.length} scholarship{boardItems.length !== 1 ? "s" : ""} saved. Access your full-screen tracker with document checklists and custom opportunity tracking.
          </p>
        </div>
        <Link
          href="/tracker"
          className="min-h-[48px] px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-white btn-primary flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <span>Open Application Tracker</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        grant={detailGrant}
        isOpen={!!detailGrant}
        boardItem={detailGrant ? boardItems.find((b) => b.grantId === detailGrant.id) ?? null : null}
        onClose={() => setDetailGrant(null)}
        onSave={handleSaveGrant}
        onMove={handleMoveItem}
        onUpdateBoardItem={handleUpdateBoardItem}
      />
    </div>
  );
}
