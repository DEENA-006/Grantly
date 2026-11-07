"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Compass,
  LayoutGrid,
  Scale,
  Calendar,
  HelpCircle,
  Volume2,
  VolumeX,
  Plus,
  Sliders,
  ChevronRight,
  X,
  PanelLeft,
  LogIn,
  LogOut,
} from "lucide-react";
import { UserProfile, initialUser } from "@/data/mockData";
import { soundFx } from "@/utils/soundEffects";

interface AppSidebarProps {
  user?: UserProfile;
  onOpenProfile?: () => void;
  onOpenOnboarding?: () => void;
  onOpenAddCustom?: () => void;
  onOpenCompare?: () => void;
  boardCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  user = initialUser,
  onOpenProfile,
  onOpenOnboarding,
  onOpenAddCustom,
  onOpenCompare,
  boardCount = 2,
  isOpenMobile = false,
  onCloseMobile,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(soundFx.enabled);
  const [liveBoardCount, setLiveBoardCount] = useState(boardCount);
  const [isVanished, setIsVanished] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const isAuth =
        localStorage.getItem("grantly_authenticated") === "true" ||
        document.cookie.includes("grantly_authenticated=true");
      setIsAuthenticated(Boolean(isAuth));
    } catch {
      // Ignore
    }
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("grantly_board_items");
      if (saved) {
        const items = JSON.parse(saved);
        setLiveBoardCount(items.length);
      }
    } catch {
      // Ignore
    }
  }, [boardCount]);

  const toggleSound = () => {
    const next = soundFx.toggle();
    setAudioEnabled(next);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("grantly_authenticated");
      sessionStorage.removeItem("grantly_authenticated");
      document.cookie = "grantly_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    } catch {
      // Ignore
    }
    soundFx.playChime(260, 0.2);
    if (onCloseMobile) onCloseMobile();
    router.push("/login?logout=true");
    router.refresh();
  };

  const navLinks = [
    {
      name: "Discovery Feed",
      href: "/",
      icon: Compass,
      active: pathname === "/",
      badge: null,
      onClick: undefined,
    },
    {
      name: "Application Tracker",
      href: "/tracker",
      icon: LayoutGrid,
      active: pathname === "/tracker",
      badge: liveBoardCount > 0 ? liveBoardCount : null,
      onClick: undefined,
    },
    {
      name: isAuthenticated ? "Lock / Sign Out" : "Student Login",
      href: isAuthenticated ? "/login?logout=true" : "/login",
      icon: isAuthenticated ? LogOut : LogIn,
      active: pathname === "/login",
      badge: null,
      onClick: isAuthenticated ? handleSignOut : undefined,
    },
  ];

  const handleCancelClick = () => {
    setIsVanished(true);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div
      data-lenis-prevent="true"
      className="h-full flex flex-col justify-between p-5 space-y-6 overflow-y-auto overscroll-contain text-[#18181B] font-sans"
      style={{
        background: "rgba(255, 255, 255, 0.78)",
        backdropFilter: "blur(28px)",
        borderRight: "1.5px solid rgba(255, 255, 255, 0.9)",
      }}
    >
      {/* Top Branding & Cancel Button */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display-serif text-2xl font-bold tracking-tight text-[#18181B]">
              Grantly<span className="text-[#FF3366]">.</span>
            </span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF3366]/10 text-[#FF3366]">
              Portal
            </span>
          </Link>

          {/* Prominent Cancel / Collapse Button */}
          <button
            type="button"
            onClick={handleCancelClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-xs font-sans font-bold text-[#18181B] transition-colors border border-black/15 shadow-sm cursor-pointer"
            title="Cancel and vanish sidebar"
          >
            <X className="w-4 h-4 text-black/70" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Primary Navigation with Inter Base Typography */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-1">
            Navigation
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  } else {
                    onCloseMobile?.();
                  }
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold transition-all ${
                  item.active
                    ? "bg-[#18181B] text-white shadow-md"
                    : "text-neutral-700 hover:text-[#18181B] hover:bg-black/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold font-sans ${
                      item.active
                        ? "bg-[#FF3366] text-white"
                        : "bg-black/10 text-[#18181B]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Tools with Inter Base Typography */}
        <div className="space-y-1.5 pt-3 border-t border-black/[0.06]">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-1">
            Student Tools
          </span>

          {onOpenAddCustom && (
            <button
              type="button"
              onClick={() => {
                onCloseMobile?.();
                onOpenAddCustom();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold text-neutral-800 hover:text-[#18181B] hover:bg-black/5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#FF3366]" />
                <span>+ Custom Grant</span>
              </div>
              <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full text-black/50 font-bold font-sans">New</span>
            </button>
          )}

          {onOpenCompare && (
            <button
              type="button"
              onClick={() => {
                onCloseMobile?.();
                onOpenCompare();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold text-neutral-800 hover:text-[#18181B] hover:bg-black/5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Compare Grants</span>
              </div>
              <ChevronRight className="w-4 h-4 text-black/30" />
            </button>
          )}

          {onOpenOnboarding && (
            <button
              type="button"
              onClick={() => {
                onCloseMobile?.();
                onOpenOnboarding();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold text-neutral-800 hover:text-[#18181B] hover:bg-black/5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Application Guide</span>
              </div>
              <span className="text-xs text-black/40 font-sans font-bold">3 Steps</span>
            </button>
          )}
        </div>

        {/* Impending Deadlines Mini Widget */}
        <div className="p-4 rounded-2xl bg-white border border-white/95 shadow-sm space-y-2.5 font-sans">
          <div className="flex items-center justify-between text-xs font-sans font-bold text-neutral-500">
            <span className="flex items-center gap-1.5 text-neutral-700">
              <Calendar className="w-4 h-4 text-[#FF3366]" />
              Impending Deadlines
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="truncate max-w-[130px] font-semibold text-[#18181B]">Women in STEM</span>
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">Dec 1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="truncate max-w-[130px] font-semibold text-[#18181B]">Global Innovators</span>
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Dec 15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="space-y-4 pt-4 border-t border-black/[0.06] font-sans">
        {/* Candidate Profile Widget */}
        {onOpenProfile && (
          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              onOpenProfile();
            }}
            className="w-full p-3.5 rounded-2xl bg-white hover:bg-neutral-100 border border-black/10 shadow-sm transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                style={{ background: "var(--ink)" }}
              >
                {user.name.charAt(0) || "S"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate text-[#18181B]">
                    {user.name}
                  </span>
                  <Sliders className="w-3.5 h-3.5 text-black/40 group-hover:text-black transition-colors" />
                </div>
                <div className="text-xs font-medium text-neutral-500 truncate">
                  GPA {user.gpa.toFixed(2)} · {user.major}
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Audio Toggle & Footer Version */}
        <div className="flex items-center justify-between text-xs font-sans text-neutral-500 pt-1">
          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer font-medium"
            title="Toggle UI Sound Effects"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-500">Muted</span>
              </>
            )}
          </button>
          <span className="text-xs font-medium text-neutral-400">
            Grantly v2.6
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Re-Open Sidebar Button when Vanished */}
      {isVanished && (
        <button
          type="button"
          onClick={() => setIsVanished(false)}
          className="fixed top-5 left-5 z-40 px-4 py-2.5 rounded-xl bg-[#18181B] text-white shadow-2xl flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-bold hover:bg-[#FF3366] transition-all cursor-pointer border border-white/20"
          title="Restore Sidebar"
        >
          <PanelLeft className="w-4 h-4 text-[#FF3366]" />
          <span>Show Menu</span>
        </button>
      )}

      {/* Desktop Persistent Sidebar (Vanishes when isVanished is true) */}
      {!isVanished && (
        <aside className="hidden lg:block w-64 xl:w-72 h-screen sticky top-0 flex-shrink-0 z-30 transition-all duration-300">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
