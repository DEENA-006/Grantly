"use client";

import { BoardItem, Scholarship } from "@/data/mockData";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";

interface Props {
  boardItems: BoardItem[];
  scholarships: Scholarship[];
}

export function FinancialSummary({ boardItems, scholarships }: Props) {
  const getAmount = (grantId: string) => {
    const s = scholarships.find((s) => s.id === grantId);
    return s ? s.amountNumeric : 0;
  };

  const totalTracked = boardItems.reduce((sum, b) => sum + getAmount(b.grantId), 0);
  const savedAmt = boardItems.filter((b) => b.status === "saved").reduce((s, b) => s + getAmount(b.grantId), 0);
  const inProgressAmt = boardItems.filter((b) => b.status === "in_progress").reduce((s, b) => s + getAmount(b.grantId), 0);
  const submittedAmt = boardItems.filter((b) => b.status === "submitted").reduce((s, b) => s + getAmount(b.grantId), 0);

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

  return (
    <div className="mb-10 p-5 sm:p-6 rounded-2xl" style={{ background: "var(--ink)", color: "#FAFAFA" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main headline */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">
            Potential Aid You&apos;re Tracking
          </p>
          <p className="font-display-serif text-3xl sm:text-4xl font-normal leading-none">
            {fmt(totalTracked)}
            <span className="text-sm font-mono opacity-40 ml-2 font-normal align-middle">total</span>
          </p>
        </div>

        {/* Breakdown pills */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
            <Clock className="w-3.5 h-3.5 opacity-60" />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest opacity-50 leading-none mb-0.5">Saved</div>
              <div className="text-sm font-semibold font-mono">{fmt(savedAmt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
            <TrendingUp className="w-3.5 h-3.5 opacity-60" />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest opacity-50 leading-none mb-0.5">In Progress</div>
              <div className="text-sm font-semibold font-mono">{fmt(inProgressAmt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
            <CheckCircle className="w-3.5 h-3.5 opacity-60" />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-widest opacity-50 leading-none mb-0.5">Submitted</div>
              <div className="text-sm font-semibold font-mono">{fmt(submittedAmt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
