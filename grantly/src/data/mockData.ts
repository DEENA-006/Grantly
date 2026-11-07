export interface UserProfile {
  name: string;
  firstName: string;
  major: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
  gpa: number;
  interests: string[];
  university: string;
}

export type AwardType = "One-Time" | "Renewable" | "Monthly Stipend";

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: string;
  amountNumeric: number;
  amountNote: string; // e.g. "per year, up to 4 years"
  deadline: string; // ISO date string
  openDate: string;
  tags: string[];
  description: string;
  whyMatched: string; // Human-readable match explanation
  matchScore: number;
  eligibility: string;
  recipientCount: number;
  awardType: AwardType;
  documentsRequired: string[];
  applicationUrl: string;
  essayPrompts: string[];
  expectedResponseDate: string;
}

export type BoardStatus = "saved" | "in_progress" | "submitted";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface BoardItem {
  grantId: string;
  status: BoardStatus;
  updatedAt: string;
  notes: string;
  checklist: ChecklistItem[];
}

export const initialUser: UserProfile = {
  name: "Deenadhayalan V.",
  firstName: "Deena",
  major: "Computer Science",
  year: "Junior",
  gpa: 9.02,
  interests: ["AI/ML", "Open Source", "Systems"],
  university: "Anna University",
};

export const initialScholarships: Scholarship[] = [
  {
    id: "g6",
    title: "Emerging Technologist Award",
    organization: "Silicon Valley Founders Guild",
    amount: "$15,000",
    amountNumeric: 15000,
    amountNote: "one-time award",
    deadline: "2027-02-14",
    openDate: "2026-11-01",
    tags: ["Innovation", "Merit", "CS"],
    matchScore: 99,
    whyMatched: "Your GPA (9.02) exceeds the threshold and your CS major aligns directly with this award's focus on software innovation.",
    eligibility: "GPA ≥ 9.0 • CS or Engineering • Strong project portfolio",
    recipientCount: 5,
    awardType: "One-Time",
    description:
      "Awarded annually to five undergraduate software builders who demonstrate exceptional initiative. Recipients are featured in the Guild's annual report and gain access to a mentorship network of 400+ founders.",
    documentsRequired: [
      "Official university transcript",
      "GitHub portfolio link",
      "2-page project impact statement",
      "One faculty recommendation letter",
    ],
    essayPrompts: [
      "Describe a technical problem you identified and the system you built to solve it. (500 words max)",
    ],
    applicationUrl: "https://svfg.org/awards/emerging-technologist",
    expectedResponseDate: "2027-03-15",
  },
  {
    id: "g3",
    title: "AI Research Stipend",
    organization: "Deep Cognition Labs",
    amount: "$12,500",
    amountNumeric: 12500,
    amountNote: "one-time stipend",
    deadline: "2026-12-28",
    openDate: "2026-10-15",
    tags: ["AI/ML", "Research", "CS"],
    matchScore: 96,
    whyMatched: "Your GPA meets the 9.0 requirement and your stated interest in AI/ML is a direct match for this research-focused stipend.",
    eligibility: "GPA ≥ 9.0 • AI, ML, or Systems research focus",
    recipientCount: 10,
    awardType: "One-Time",
    description:
      "Funds undergraduate AI and machine learning research projects. Recipients present findings at the annual Deep Cognition symposium. No repayment required.",
    documentsRequired: [
      "Official transcript",
      "1-page research proposal",
      "Advisor endorsement email",
    ],
    essayPrompts: [
      "What problem in AI/ML do you want to investigate, and what approach will you take? (400 words max)",
    ],
    applicationUrl: "https://deepcognition.io/stipend",
    expectedResponseDate: "2027-01-20",
  },
  {
    id: "g2",
    title: "Global Innovators Fund",
    organization: "Global Frontier Council",
    amount: "$10,000",
    amountNumeric: 10000,
    amountNote: "one-time grant",
    deadline: "2026-12-15",
    openDate: "2026-10-01",
    tags: ["Innovation", "CS", "Merit"],
    matchScore: 98,
    whyMatched: "Strong GPA match (9.02 vs required 8.5) and your CS background aligns with this fund's distributed systems focus.",
    eligibility: "GPA ≥ 8.5 • Computer Science or Engineering",
    recipientCount: 20,
    awardType: "One-Time",
    description:
      "Supports undergraduate engineers working on scalable, real-world technology solutions. Applications are reviewed by a panel of industry engineers and academics.",
    documentsRequired: [
      "Official transcript",
      "Project portfolio (GitHub or PDF)",
      "500-word personal statement",
      "Two reference letters",
    ],
    essayPrompts: [
      "Describe a technology challenge you've worked on and its potential societal impact. (500 words max)",
    ],
    applicationUrl: "https://globalfrontiercouncil.org/innovators-fund",
    expectedResponseDate: "2027-01-10",
  },
  {
    id: "g4",
    title: "Open Source Fellowship",
    organization: "Open Systems Initiative",
    amount: "$8,000",
    amountNumeric: 8000,
    amountNote: "one-time fellowship",
    deadline: "2027-01-10",
    openDate: "2026-11-01",
    tags: ["Open Source", "CS", "Innovation"],
    matchScore: 92,
    whyMatched: "Your CS major and interest in open source development are strong signals for this fellowship. No minimum GPA required.",
    eligibility: "Any engineering major • Demonstrated open-source contributions",
    recipientCount: 15,
    awardType: "One-Time",
    description:
      "Recognizes students who actively contribute to open-source projects. A link to your public contributions (GitHub, GitLab, etc.) is required. No essays — your code speaks for itself.",
    documentsRequired: [
      "GitHub or GitLab profile link",
      "List of top 3 open-source contributions with brief context",
      "Transcript (unofficial accepted)",
    ],
    essayPrompts: [],
    applicationUrl: "https://opensystems.org/fellowship",
    expectedResponseDate: "2027-02-01",
  },
  {
    id: "g1",
    title: "Women in STEM Scholarship",
    organization: "EmpowerTech Foundation",
    amount: "$5,000",
    amountNumeric: 5000,
    amountNote: "per year, renewable for 2 years",
    deadline: "2026-12-01",
    openDate: "2026-09-15",
    tags: ["Diversity", "Merit", "STEM"],
    matchScore: 88,
    whyMatched: "Your GPA (9.02) exceeds the 8.0 requirement and your CS major falls within the eligible STEM disciplines.",
    eligibility: "GPA ≥ 8.0 • STEM disciplines • Self-identify as woman or non-binary",
    recipientCount: 30,
    awardType: "Renewable",
    description:
      "A renewable merit scholarship supporting women and non-binary students in STEM fields. Recipients join a cohort of 500+ scholars with access to mentoring events, networking, and internship referrals.",
    documentsRequired: [
      "Official transcript",
      "300-word personal statement",
      "One recommendation letter",
    ],
    essayPrompts: [
      "Tell us about a moment when you felt you belonged in STEM — or when you didn't, and how you pushed through. (300 words max)",
    ],
    applicationUrl: "https://empowertech.org/women-in-stem",
    expectedResponseDate: "2027-01-05",
  },
  {
    id: "g5",
    title: "Algorithmic Integrity Award",
    organization: "Ethical Computing Institute",
    amount: "$6,500",
    amountNumeric: 6500,
    amountNote: "one-time award",
    deadline: "2027-01-25",
    openDate: "2026-11-15",
    tags: ["CS", "Ethics", "Merit"],
    matchScore: 91,
    whyMatched: "Your GPA meets the 8.8 threshold and your CS background is relevant to this ethics-in-computing award.",
    eligibility: "GPA ≥ 8.8 • CS, Mathematics, or Data Science",
    recipientCount: 8,
    awardType: "One-Time",
    description:
      "Honors undergraduates researching responsible computing — fairness in algorithms, privacy-preserving systems, and AI safety. Strong preference for applicants with published or submitted academic work.",
    documentsRequired: [
      "Official transcript",
      "Research paper or project summary (PDF)",
      "400-word statement on ethical computing",
      "One academic reference",
    ],
    essayPrompts: [
      "Describe a bias or ethical issue in a technology system and propose a concrete solution. (400 words max)",
    ],
    applicationUrl: "https://ethicalcomputing.org/integrity-award",
    expectedResponseDate: "2027-02-20",
  },
];

export const initialBoardItems: BoardItem[] = [
  {
    grantId: "g2",
    status: "saved",
    updatedAt: "2026-11-07",
    notes: "",
    checklist: [],
  },
  {
    grantId: "g1",
    status: "saved",
    updatedAt: "2026-11-07",
    notes: "",
    checklist: [],
  },
];

// --- Utility Functions ---

// Current scholarship season reference date for deterministic countdowns
const CURRENT_SEASON_REFERENCE = new Date("2026-11-07T00:00:00Z");

export function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - CURRENT_SEASON_REFERENCE.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDeadlineLabel(deadline: string): {
  label: string;
  urgency: "critical" | "soon" | "comfortable" | "expired";
} {
  const days = getDaysUntilDeadline(deadline);
  if (days < 0) return { label: "Deadline passed", urgency: "expired" };
  if (days === 0) return { label: "Due today", urgency: "critical" };
  if (days === 1) return { label: "1 day left", urgency: "critical" };
  if (days <= 7) return { label: `${days} days left`, urgency: "critical" };
  if (days <= 21) return { label: `${days} days left`, urgency: "soon" };
  if (days <= 60) return { label: `${days} days left`, urgency: "comfortable" };
  const months = Math.floor(days / 30);
  return { label: `~${months} month${months > 1 ? "s" : ""} left`, urgency: "comfortable" };
}

export function formatAmount(amount: string): string {
  return `${amount}`;
}

export function calculateScholarshipMatch(
  scholarship: Scholarship,
  user: UserProfile
): { matchScore: number; whyMatched: string } {
  let score = 50;
  const reasons: string[] = [];

  // 1. GPA check
  const gpaMatch = scholarship.eligibility.match(/GPA\s*[≥>=]\s*([\d.]+)/i);
  const minGpa = gpaMatch ? parseFloat(gpaMatch[1]) : 8.0;

  if (user.gpa >= minGpa) {
    const diff = (user.gpa - minGpa).toFixed(2);
    score += 25;
    if (parseFloat(diff) > 0) {
      reasons.push(`Your GPA (${user.gpa.toFixed(2)}) comfortably clears the ${minGpa} benchmark (+${diff})`);
    } else {
      reasons.push(`Your GPA (${user.gpa.toFixed(2)}) meets the minimum ${minGpa} requirement`);
    }
  } else {
    const gap = (minGpa - user.gpa).toFixed(2);
    score -= 20;
    reasons.push(`Your GPA (${user.gpa.toFixed(2)}) is below the preferred ${minGpa} cutoff (-${gap})`);
  }

  // 2. Major check
  const lowerMajor = user.major.toLowerCase();
  const isCsOrTech = lowerMajor.includes("computer") || lowerMajor.includes("data") || lowerMajor.includes("software") || lowerMajor.includes("cs");
  const isEngineering = lowerMajor.includes("engineering") || isCsOrTech;

  if (scholarship.tags.includes("CS") || scholarship.tags.includes("Tech")) {
    if (isCsOrTech) {
      score += 15;
      reasons.push(`Your ${user.major} degree directly satisfies the technical focus`);
    } else if (isEngineering) {
      score += 8;
      reasons.push(`Your ${user.major} major partially aligns with the engineering discipline`);
    } else {
      score -= 10;
      reasons.push(`Preferred for software and engineering candidates`);
    }
  }

  // 3. Interests check
  const matchingInterests = user.interests.filter((interest) =>
    scholarship.tags.some((t) => t.toLowerCase() === interest.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(interest.toLowerCase())
  );

  if (matchingInterests.length > 0) {
    score += 10;
    reasons.push(`Demonstrated interest in ${matchingInterests.join(" & ")} strengthens your application`);
  }

  // Final score clamping
  const finalScore = Math.min(99, Math.max(35, Math.round(score)));
  const whyMatched = reasons.join(". ") + ".";

  return {
    matchScore: finalScore,
    whyMatched,
  };
}

