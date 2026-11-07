"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroVisualCenterpiece } from "@/components/HeroVisualCenterpiece";
import { DashboardContainer } from "@/components/DashboardContainer";
import { AppSidebar } from "@/components/AppSidebar";
import { StudentProfileModal } from "@/components/StudentProfileModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ScholarshipCompareModal } from "@/components/ScholarshipCompareModal";
import { AddCustomScholarshipModal } from "@/components/AddCustomScholarshipModal";
import {
  UserProfile,
  Scholarship,
  initialUser,
  initialScholarships,
  calculateScholarshipMatch,
} from "@/data/mockData";
import {
  GraduationCap,
  BookOpen,
  Award,
  ArrowDown,
  HelpCircle,
  Sparkles,
  Menu,
  LayoutGrid,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareGrants, setCompareGrants] = useState<Scholarship[]>([]);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [boardCount, setBoardCount] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);

  // Authentication Guard: Check if student has entered PIN clearance
  useEffect(() => {
    try {
      const isAuth =
        localStorage.getItem("grantly_authenticated") === "true" ||
        sessionStorage.getItem("grantly_authenticated") === "true" ||
        document.cookie.includes("grantly_authenticated=true");

      if (!isAuth) {
        router.replace("/login");
        return;
      }
      setIsAuthenticated(true);
    } catch {
      router.replace("/login");
      return;
    }
  }, [router]);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("grantly_user_profile");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedBoard = localStorage.getItem("grantly_board_items");
      if (savedBoard) {
        setBoardCount(JSON.parse(savedBoard).length);
      }
      const savedCustom = localStorage.getItem("grantly_custom_scholarships");
      if (savedCustom) {
        const customItems: Scholarship[] = JSON.parse(savedCustom);
        setScholarships((prev) => [...customItems, ...prev]);
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  // Recalculate match scores whenever user profile updates
  useEffect(() => {
    if (!isLoaded) return;

    setScholarships((prev) =>
      prev.map((grant) => {
        const matchResult = calculateScholarshipMatch(grant, user);
        return {
          ...grant,
          matchScore: matchResult.matchScore,
          whyMatched: matchResult.whyMatched,
        };
      })
    );
  }, [user, isLoaded]);

  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem("grantly_user_profile", JSON.stringify(updatedUser));
    } catch {
      // Ignore
    }
  };

  const handleAddCustom = (newScholarship: Scholarship) => {
    setScholarships((prev) => [newScholarship, ...prev]);
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

  const scrollToFeed = () => {
    const feedElement = document.getElementById("discovery-feed");
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenCompare = (selectedGrants: Scholarship[]) => {
    setCompareGrants(selectedGrants);
    setIsCompareModalOpen(true);
  };

  // Calculate dynamic stats
  const totalAidNumeric = scholarships.reduce((sum, s) => sum + s.amountNumeric, 0);
  const totalAidFormatted = `$${(totalAidNumeric / 1000).toFixed(0)},000+`;
  const matchedCount = scholarships.length;

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
      {/* ── APP SIDEBAR (Left Navigation with Cancel / Collapse Button) ── */}
      <AppSidebar
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        onOpenAddCustom={() => setIsAddCustomOpen(true)}
        onOpenCompare={() => {
          setCompareGrants(scholarships.slice(0, 3));
          setIsCompareModalOpen(true);
        }}
        boardCount={boardCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ── MAIN CONTENT AREA ────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar */}
        <header className="lg:hidden px-6 py-4 border-b flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-black/70 hover:text-black cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display-serif text-lg font-bold">
            Grantly<span className="text-[#FF3366]">.</span>
          </span>
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-primary text-xs font-mono uppercase tracking-wider"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board ({boardCount})</span>
          </Link>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-6 sm:px-10 md:px-12 lg:px-16 py-8 max-w-[1600px] mx-auto w-full space-y-12">
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-black/[0.05]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-black/50 font-bold">Active View</span>
              <span className="text-black/30">/</span>
              <span className="text-xs font-mono uppercase tracking-wider font-extrabold text-[#FF3366]">
                Discovery Feed
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/tracker"
                className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 btn-secondary cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-[#FF3366]" />
                <span>Application Tracker (My Board) →</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 border border-black/15 shadow-sm transition-all text-left cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ background: "var(--ink)" }}
                >
                  {user.name.charAt(0) || "D"}
                </div>
                <div className="text-xs font-bold text-[#18181B]">
                  {user.name} <span className="text-black/50 font-medium">· GPA {user.gpa.toFixed(2)}</span>
                </div>
              </button>
            </div>
          </div>

          {/* ── HERO SECTION: BESPOKE PAINTED MURAL WITH EDGE-TO-EDGE BACKDROP ──── */}
          <section
            className="relative min-h-[560px] lg:min-h-[78vh] border-b overflow-hidden flex flex-col justify-center rounded-3xl"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "#FAFAFA" }}
          >
            {/* Soft WebGL ambient light source */}
            <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none z-0 overflow-hidden opacity-30">
              <HeroVisualCenterpiece />
            </div>

            {/* Edge-to-Edge Bespoke Painted Mural Container (Right 50% on desktop) */}
            <div className="w-full lg:w-1/2 min-h-[380px] sm:min-h-[480px] lg:min-h-full relative overflow-hidden lg:absolute lg:right-0 lg:top-0 lg:bottom-0 z-0">
              {/* Immersive Image completely filling the space without distortion */}
              <img
                src="/hero-student-illustration.jpg"
                alt="Grantly Student Discovery Mural"
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
              />

              {/* Seamless Left Edge Fade into the off-white background */}
              <div className="absolute inset-y-0 left-0 w-32 sm:w-52 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

              {/* Seamless Top & Bottom Blends */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAFAFA]/70 to-transparent z-10 pointer-events-none" />
            </div>

            {/* Left Column (50% on desktop): Foreground Headline, CTAs, and Stats */}
            <div className="w-full lg:w-1/2 relative z-20 py-10 lg:py-16 pr-0 lg:pr-10 space-y-7">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored for {user.firstName}
                </span>
                <span className="text-black/30">·</span>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xs font-mono font-bold text-black/70 hover:text-[#FF3366] underline underline-offset-4 cursor-pointer"
                >
                  Change GPA &amp; Major
                </button>
              </div>

              <h1
                className="font-display-serif leading-[0.92] tracking-[-0.035em] text-[#18181B]"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)" }}
              >
                Find scholarships
                <span className="block italic font-normal mt-2 text-[#18181B]/85">
                  that fit you<span className="text-[#FF3366]">.</span>
                </span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-lg text-[#18181B]/80 font-sans">
                A frictionless, visually immersive dashboard that revolutionizes how you discover and manage scholarships. Personalize your feed, drag-and-drop your Kanban tracker, and transform complex bureaucratic applications into a seamless digital journey.
              </p>

              {/* Action Buttons: High-Contrast, Clearly Visible & Tactile */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToFeed}
                  className="min-h-[48px] px-7 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-white btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Explore Matched Grants</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <Link
                  href="/tracker"
                  className="min-h-[48px] px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold btn-secondary flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <LayoutGrid className="w-4 h-4 text-[#FF3366]" />
                  <span>My Board ({boardCount})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="min-h-[48px] px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-[#18181B] bg-white border-2 border-black/15 hover:border-black flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-black/50" />
                  <span>Guide</span>
                </button>
              </div>

              {/* Dynamic Stats Strip with Frosted Glass Styling */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 glass-card p-4 sm:p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#FF3366]" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-black/50 font-bold">
                      Available Aid Pool
                    </div>
                    <div className="text-lg font-bold font-mono tracking-tight text-[#18181B]">
                      {totalAidFormatted}
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 hidden sm:block bg-black/15" />
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#FF3366]" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-black/50 font-bold">
                      Matched Opportunities
                    </div>
                    <div className="text-lg font-bold font-mono tracking-tight text-[#18181B]">
                      {matchedCount} Found
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 hidden sm:block bg-black/15" />
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#FF3366]" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-black/50 font-bold">
                      Next Deadline
                    </div>
                    <div className="text-lg font-bold font-mono tracking-tight text-[#18181B]">
                      Dec 1, 2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── EXPANSIVE FULL-WIDTH DISCOVERY FEED (NO KANBAN BOARD SQUISHING) ── */}
          <div id="discovery-feed">
            <DashboardContainer
              initialScholarshipsProp={scholarships}
              onOpenCompare={handleOpenCompare}
            />
          </div>

          {/* ── FOOTER ───────────────────────────────────────────── */}
          <footer
            className="py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-black/50"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <span className="font-display-serif font-bold text-sm text-[#18181B]">
                Grantly<span className="text-[#FF3366]">.</span>
              </span>
              <span>© 2026 · Built to empower student journeys.</span>
            </div>
            <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setIsOnboardingModalOpen(true)}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Guide
              </button>
              <Link href="/tracker" className="hover:text-black transition-colors">
                Tracker Board
              </Link>
              <a href="#" className="hover:text-black transition-colors">
                About
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Contact Support
              </a>
            </nav>
          </footer>
        </main>
      </div>

      {/* ── MODALS ──────────────────────────────────────────────── */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSaveUser={handleSaveUser}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

      <ScholarshipCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedScholarships={compareGrants.length > 0 ? compareGrants : scholarships.slice(0, 3)}
        onSaveGrant={() => {
          // Handled via storage
        }}
        isGrantInBoard={() => false}
      />

      <AddCustomScholarshipModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAddScholarship={handleAddCustom}
      />
    </div>
  );
}
