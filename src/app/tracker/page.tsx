"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ApplicationDetailModal } from "@/components/ApplicationDetailModal";
import { AddCustomScholarshipModal } from "@/components/AddCustomScholarshipModal";
import { StudentProfileModal } from "@/components/StudentProfileModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { FinancialSummary } from "@/components/FinancialSummary";
import {
  Scholarship,
  BoardItem,
  BoardStatus,
  UserProfile,
  initialUser,
  initialScholarships,
  initialBoardItems,
} from "@/data/mockData";
import { soundFx } from "@/utils/soundEffects";
import {
  Menu,
  Plus,
  Printer,
  ArrowLeft,
} from "lucide-react";

export function TrackerPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [boardItems, setBoardItems] = useState<BoardItem[]>(initialBoardItems);
  const [detailGrant, setDetailGrant] = useState<Scholarship | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Authentication Guard with Self-Healing Cookie Sync
  useEffect(() => {
    try {
      const isLocalAuth = localStorage.getItem("grantly_authenticated") === "true";
      const isSessionAuth = sessionStorage.getItem("grantly_authenticated") === "true";
      const isCookieAuth = document.cookie.includes("grantly_authenticated=true");

      const isAuth = isLocalAuth || isSessionAuth || isCookieAuth;

      if (!isAuth) {
        router.replace("/login?from=/tracker");
        return;
      }

      // Self-heal: ensure server cookie is present if local storage is valid
      if (!isCookieAuth && typeof window !== "undefined") {
        document.cookie = `grantly_authenticated=true; path=/; max-age=2592000; SameSite=Lax${
          window.location.protocol === "https:" ? "; Secure" : ""
        }`;
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: "9020" }),
        }).catch(() => {});
      }

      setIsAuthenticated(true);
    } catch {
      router.replace("/login?from=/tracker");
      return;
    }
  }, [router]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("grantly_user_profile");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedBoard = localStorage.getItem("grantly_board_items");
      if (savedBoard) setBoardItems(JSON.parse(savedBoard));

      const savedCustomGrants = localStorage.getItem("grantly_custom_scholarships");
      if (savedCustomGrants) {
        const customItems: Scholarship[] = JSON.parse(savedCustomGrants);
        setScholarships((prev) => [...customItems, ...prev]);
      }
    } catch {
      // Ignore
    }
  }, []);

  const persistBoard = (items: BoardItem[]) => {
    setBoardItems(items);
    try {
      localStorage.setItem("grantly_board_items", JSON.stringify(items));
    } catch {
      // Ignore
    }
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

  const handleRemoveItem = (grantId: string) => {
    const updated = boardItems.filter((item) => item.grantId !== grantId);
    persistBoard(updated);
  };

  const handleUpdateBoardItem = (grantId: string, updates: Partial<BoardItem>) => {
    const updated = boardItems.map((item) =>
      item.grantId === grantId ? { ...item, ...updates } : item
    );
    persistBoard(updated);
  };

  const handleAddCustomScholarship = (newScholarship: Scholarship) => {
    setScholarships((prev) => [newScholarship, ...prev]);
    const newItem: BoardItem = {
      grantId: newScholarship.id,
      status: "saved",
      updatedAt: new Date().toISOString(),
      notes: newScholarship.description,
      checklist: newScholarship.documentsRequired.map((doc, idx) => ({
        id: `custom_doc_${idx}`,
        label: doc,
        done: false,
      })),
    };
    persistBoard([newItem, ...boardItems]);
    soundFx.playSave();

    try {
      const existing = localStorage.getItem("grantly_custom_scholarships");
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(
        "grantly_custom_scholarships",
        JSON.stringify([newScholarship, ...list])
      );
    } catch {
      // Ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 rounded-full border-2 border-[#18181B]/15 border-t-[#FF3366] animate-spin mb-4" />
        <div className="font-display-serif text-2xl font-bold text-[#18181B]">
          Verifying Student Clearance...
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-black/50 mt-1">
          Directing to Grantly Gateway
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-[#18181B]">
      {/* Persistent App Sidebar */}
      <AppSidebar
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        onOpenAddCustom={() => setIsAddCustomOpen(true)}
        boardCount={boardItems.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Page Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar */}
        <header className="lg:hidden px-6 py-4 border-b flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-black/60 hover:text-black"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display-serif text-lg font-bold">
            Grantly<span className="text-[#FF3366]">.</span>
          </span>
          <button
            onClick={() => setIsAddCustomOpen(true)}
            className="p-2 -mr-2 text-[#FF3366] font-mono text-xs uppercase"
          >
            + Add
          </button>
        </header>

        {/* Content Container */}
        <main className="flex-1 px-6 sm:px-10 md:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Tracker Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.05]">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-black/50 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Discovery Feed</span>
                </Link>
                <span className="text-black/30">/</span>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#FF3366]">
                  Application Tracker
                </span>
              </div>
              <h1 className="font-display-serif text-3xl sm:text-4xl font-normal text-[#18181B]">
                My Application Tracker
              </h1>
              <p className="text-sm text-black/60 font-sans">
                Manage your candidates, track essay drafts &amp; checklist items, and monitor review decisions.
              </p>
            </div>

            {/* Actions: + Add Custom Grant & Print Summary */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold btn-secondary flex items-center gap-2 cursor-pointer"
                title="Print or export application summary"
              >
                <Printer className="w-3.5 h-3.5 text-[#18181B]" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddCustomOpen(true)}
                className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-white btn-primary flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Custom Grant</span>
              </button>
            </div>
          </div>

          {/* Financial Summary Strip */}
          {boardItems.length > 0 && (
            <FinancialSummary boardItems={boardItems} scholarships={scholarships} />
          )}

          {/* Dedicated Full Kanban Tracker */}
          <div className="pt-2">
            <KanbanBoard
              boardItems={boardItems}
              scholarships={scholarships}
              onMoveItem={handleMoveItem}
              onRemoveItem={handleRemoveItem}
              onOpenDetail={(grant) => setDetailGrant(grant)}
              onUpdateBoardItem={handleUpdateBoardItem}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <ApplicationDetailModal
        grant={detailGrant}
        isOpen={!!detailGrant}
        boardItem={detailGrant ? boardItems.find((b) => b.grantId === detailGrant.id) ?? null : null}
        onClose={() => setDetailGrant(null)}
        onSave={() => {}}
        onMove={handleMoveItem}
        onUpdateBoardItem={handleUpdateBoardItem}
      />

      <AddCustomScholarshipModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAddScholarship={handleAddCustomScholarship}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSaveUser={(u) => {
          setUser(u);
          localStorage.setItem("grantly_user_profile", JSON.stringify(u));
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />
    </div>
  );
}

export default TrackerPage;

