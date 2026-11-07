"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldAlert, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { soundFx } from "@/utils/soundEffects";

// Authorized demo clearance PINs
const VALID_PINS = ["9020", "2026", "1234", "0000"];

export default function LoginPage() {
  const router = useRouter();

  // 4 individual digit slots
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on load & check logout/existing auth status
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("logout") === "true") {
        localStorage.removeItem("grantly_authenticated");
        sessionStorage.removeItem("grantly_authenticated");
        document.cookie = "grantly_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        setIsAlreadyAuthenticated(false);
      } else {
        const isAuth =
          localStorage.getItem("grantly_authenticated") === "true" ||
          sessionStorage.getItem("grantly_authenticated") === "true" ||
          document.cookie.includes("grantly_authenticated=true");
        if (isAuth) {
          setIsAlreadyAuthenticated(true);
        }
      }
    } catch {
      // Ignore
    }
    inputRefs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rate-limiting: Countdown timer for security cooldown
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          setErrorMessage("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // SHIELD Protocol: /sanitize-forms (strip all non-numeric characters)
  const sanitizeDigit = (val: string): string => {
    return val.replace(/\D/g, "").slice(-1);
  };

  const handleInputChange = (index: number, rawValue: string) => {
    if (lockoutTimer > 0 || status === "success" || status === "verifying") return;

    const sanitized = sanitizeDigit(rawValue);
    const newDigits = [...pinDigits];
    newDigits[index] = sanitized;
    setPinDigits(newDigits);
    setErrorMessage("");

    // Auto-advance to next input slot if digit entered
    if (sanitized && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submitting OTP Flow: Verify immediately when 4th digit is entered
    if (sanitized && index === 3) {
      const fullPin = newDigits.join("");
      if (fullPin.length === 4) {
        verifyPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      // Auto-retreat to previous input slot on backspace
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    // SHIELD: Sanitize pasted content
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const newDigits = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setPinDigits(newDigits);

    if (pasted.length === 4) {
      verifyPin(pasted);
    } else {
      inputRefs[Math.min(pasted.length, 3)].current?.focus();
    }
  };

  // SHIELD & CLEAR Verification Logic
  const verifyPin = (pin: string) => {
    // SHIELD: Rate-limiting lockout check
    if (failedAttempts >= 2) {
      setLockoutTimer(30);
      setErrorMessage("SHIELD Lockout: 3 failed attempts. Security cooldown active.");
      soundFx.playChime(300, 0.2);
      return;
    }

    setStatus("verifying");

    setTimeout(() => {
      if (VALID_PINS.includes(pin)) {
        // Correct PIN
        setStatus("success");
        soundFx.playSuccess();

        // Store clearance in session, local storage and cookies
        try {
          sessionStorage.setItem("grantly_authenticated", "true");
          localStorage.setItem("grantly_authenticated", "true");
          document.cookie = "grantly_authenticated=true; path=/; max-age=86400; SameSite=Lax";
        } catch {
          // Ignore
        }

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 850);
      } else {
        // Incorrect PIN -> Trigger horizontal shake & rate limit counter
        setStatus("error");
        soundFx.playChime(220, 0.2);
        setFailedAttempts((prev) => prev + 1);
        setErrorMessage(
          failedAttempts + 1 >= 3
            ? "SHIELD Lockout: 3 failed attempts. Security cooldown active (30s)."
            : `Invalid Clearance PIN (${3 - (failedAttempts + 1)} attempts remaining)`
        );

        if (failedAttempts + 1 >= 3) {
          setLockoutTimer(30);
        }

        // Clear inputs after brief shake
        setTimeout(() => {
          setPinDigits(["", "", "", ""]);
          setStatus("idle");
          inputRefs[0].current?.focus();
        }, 700);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] text-[#18181B] relative overflow-hidden font-sans">
      {/* ── LEFT BRANDING SECTION (Massive Stark Typography) ────── */}
      <div className="w-full lg:w-1/2 p-8 sm:p-14 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/[0.06] relative z-10">
        <div>
          {isAlreadyAuthenticated ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/70 hover:text-[#FF3366] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue to Dashboard</span>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/50">
              <Lock className="w-3.5 h-3.5 text-[#FF3366]" />
              <span>Student Clearance Required</span>
            </div>
          )}
        </div>

        <div className="py-12 lg:py-0 space-y-6 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF3366] font-bold">
              SHIELD Protocol Protected
            </span>
          </div>

          <h1 className="font-display-serif text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#18181B]">
            Student
            <span className="block italic font-normal text-[#18181B]/80 mt-1">
              access gateway<span className="text-[#FF3366]">.</span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-black/60 leading-relaxed font-sans max-w-md">
            Grantly is a frictionless, visually immersive dashboard that revolutionizes how you discover and manage scholarships. Enter your 4-digit Student Clearance PIN for instant access to your personalized discovery feed and Kanban board.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-black/40 uppercase tracking-wider">
            <span>Client AES-256</span>
            <span>•</span>
            <span>Rate-Limit Guard</span>
            <span>•</span>
            <span>XSS Sanitized</span>
          </div>
        </div>

        <div className="text-xs font-mono text-black/40 uppercase tracking-wider hidden lg:block">
          Grantly Academic Access • Deenadhayalan V. (Anna University)
        </div>
      </div>

      {/* ── RIGHT AUTHENTICATION FLOW (CLEAR Minimalist Auto-Submit) ── */}
      <div className="w-full lg:w-1/2 p-8 sm:p-14 lg:p-20 flex flex-col justify-center items-center relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#FF3366] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              CLEAR Authentication
            </span>
            <h2 className="font-display-serif text-3xl sm:text-4xl text-[#18181B] tracking-tight">
              Student Access
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-black/50">
              Enter Clearance PIN
            </p>

            {isAlreadyAuthenticated && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-sans text-emerald-800 flex items-center justify-between">
                <span>Active clearance found for Deenadhayalan V.</span>
                <Link
                  href="/"
                  className="font-bold underline text-emerald-900 hover:text-emerald-700 ml-2"
                >
                  Go to Dashboard &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Frictionless 4-Digit Slot Container with Framer Motion Shake Animation */}
          <motion.div
            animate={
              status === "error"
                ? { x: [-12, 12, -8, 8, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* Success Checkmark Morph */
                <motion.div
                  key="success-checkmark"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 flex flex-col items-center justify-center space-y-3 bg-emerald-50 rounded-2xl border-2 border-emerald-200"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-bold">
                    Clearance Authorized — Entering Portal…
                  </span>
                </motion.div>
              ) : (
                /* 4 Separate Frictionless Underline Slots */
                <div key="pin-slots" className="flex items-center justify-between gap-4">
                  {pinDigits.map((digit, idx) => (
                    <div key={idx} className="flex-1">
                      <input
                        ref={inputRefs[idx]}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={lockoutTimer > 0 || status === "verifying"}
                        value={digit}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                        className={`w-full text-center text-4xl sm:text-5xl font-mono font-bold py-4 bg-transparent border-b-2 transition-all outline-none ${
                          status === "error"
                            ? "border-red-500 text-red-600"
                            : digit
                            ? "border-[#18181B] text-[#18181B]"
                            : "border-neutral-300 text-[#18181B] focus:border-[#FF3366]"
                        } ${lockoutTimer > 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                        placeholder="•"
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Status & Error Feedback */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-semibold"
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {lockoutTimer > 0 && (
              <div className="text-center font-mono text-xs text-red-600 font-bold">
                Security cooldown: {lockoutTimer}s remaining
              </div>
            )}
          </motion.div>

          {/* Brutalist Microcopy Hint & Demo Clearance Credentials */}
          <div className="pt-6 border-t border-black/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-black/50 uppercase tracking-wider">
              <span>Auto-Submitting</span>
              <span className="text-[#FF3366] font-bold">4 Digits Clear</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-black/10 text-xs font-mono text-black/60 space-y-1 shadow-sm">
              <span className="font-bold text-[#18181B] block">Demo Clearance Credentials:</span>
              <p>PIN: <strong className="text-[#FF3366]">9020</strong> (from GPA 9.02) or <strong className="text-[#FF3366]">2026</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

