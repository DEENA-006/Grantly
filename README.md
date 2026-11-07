# GRANTLY — Rethinking the Scholarship Experience

> **"Grantly is a frictionless, visually immersive dashboard that revolutionizes how students discover and manage scholarships. It combines a personalized, fast-scrolling discovery feed with an interactive, drag-and-drop Kanban tracker, transforming a traditionally complex bureaucratic process into a seamless, highly secure digital journey."**

---

## 🎓 The Problem & Mission
Accessing educational financial assistance has historically been a confusing, bureaucratic, and demoralizing ordeal for students:
- Scholarship opportunities are scattered across opaque, outdated portals.
- Eligibility requirements are written in convoluted administrative jargon.
- Tracking application milestones, recommendation letters, essays, and critical deadlines creates overwhelming cognitive overload.

**Grantly** rethinks this entire journey from first principles, replacing bureaucratic friction with an intuitive, aesthetic, and empowering digital experience.

---

## ⚡ Key Highlights & Architecture

### 1. 🛡️ Gateway Clearance (CLEAR & SHIELD Protocols)
- **Frictionless Underline Slots:** 4 minimalist, non-boxed PIN input slots with auto-advance and backspace auto-retreat.
- **Auto-Submitting Flow:** The gateway verifies credentials instantly the moment the 4th digit is entered—no manual submit button required.
- **SHIELD Rate Limiting:** 3-attempt lockout with an automated 30-second security cooldown timer and XSS input sanitization.
- **Demo Clearance PINs:** `9020` (derived from Candidate GPA 9.02) or `2026`.

### 2. 🎨 Visually Immersive Editorial Aesthetic
- **Bespoke Mural Artwork:** Edge-to-edge student illustration seamlessly blended into the canvas via custom horizontal gradient masks.
- **High-Visibility Glassmorphism:** Translucent frosted cards (`backdrop-blur-2xl`, specular white borders `border-white/60`, and ambient pink/peach radial glow blobs).
- **Refined Typography:** High-contrast editorial headers set in *Playfair Display* paired with ultra-clean *Inter* microcopy.

### 3. 🔍 Personalized Discovery Feed
- **Dynamic Matching Engine:** Match scores recalculate in real time as the student adjusts their GPA slider, Major, or Academic Interests.
- **Urgency Countdown Badges:** Visual status alerts distinguishing impending deadlines (`urgent`, `soon`, `comfortable`).
- **Side-by-Side Comparison:** Compare up to 3 awards across amounts, renewal terms, required documents, and match factors.

### 4. 📋 Interactive Kanban Application Tracker (`/tracker`)
- **Tactile Application Pipeline:** Full drag-and-drop workflow across **Saved**, **In Progress**, and **Submitted** columns.
- **Document Requirements Checklist:** Interactive task tracking with real-time progress indicators.
- **One-Click Calendar Sync:** Export crucial submission deadlines directly to Google Calendar or `.ics` formats.
- **Add External Grants:** Track custom campus grants and private endowments in your unified board.

---

## 🧑‍💻 Candidate Profile
- **Scholar:** Deenadhayalan V.
- **Institution:** Anna University
- **Discipline:** B.E. Computer Science & Engineering
- **Current Standing:** Junior Year · GPA: **9.02 / 10.0**
- **Default PIN:** `9020`

---

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **Styling:** Tailwind CSS v4, Custom Specular Glassmorphism Tokens
- **Animations:** Framer Motion, Studio Freight Lenis Smooth Scroll
- **3D & Canvas:** React Three Fiber, Three.js (Ambient Fluid Mesh)
- **Icons & Sounds:** Lucide React, Web Audio API Micro-Synth Engine
- **Deployment:** Vercel Zero-Config Deployment

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/DEENA-006/Grantly.git
cd Grantly

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
1. You will be greeted by the **CLEAR Authentication Gateway**.
2. Enter PIN **`9020`** (or **`2026`**).
3. Experience the full **Discovery Feed** and **Kanban Application Tracker**.

---

## 🌐 Deploy to Vercel

Grantly includes root [`vercel.json`](./vercel.json) and workspace scripts configured for zero-configuration Vercel deployment:
- **Build Command:** `npm --prefix grantly run build`
- **Output Directory:** `grantly/.next`
- **Root Directory:** `./` (or `grantly`)

---

*Built with passion for The Outpost 6-Hour Hackathon.*
