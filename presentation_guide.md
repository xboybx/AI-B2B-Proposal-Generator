# Video Presentation Guide: Rayeva B2B Proposal Generator

Use this guide to structure your video walkthrough. It is organized to show the "Magic" first (the UI), and then the "Brain" (the Code).

---

## 🎬 Part 1: Intro & The "Rayeva Pulse 2026" UI
**Goal:** Wow the audience with the premium look and feel.

### 1. The Dashboard (Home)
- **Visuals:** Hover over the Bento Cards, show the background pulse animation.
- **Talking Points:**
    - "This isn't just a form; it's a **Proposal Engine** designed for 2026."
    - "We use **Glassmorphism** and a **Bento Grid** layout to separate 'Inputs' (The Engine) from 'Outputs' (The Canvas)."
    - "The goal was to make a POC that feels like a $100M SaaS product."

### 2. The Floating Library
- **Action:** Open/Close the sidebar (Hamburger menu).
- **Talking Points:**
    - "Instead of a clunky side-nav, we have a **Floating Glass Console** for saved history."
    - "This keeps the focus on the active creation process."

---

## 🚀 Part 2: The Core User Flow
**Goal:** Demonstrate the AI power in real-time.

### 1. The Generation Process
- **Action:** Fill out a quick example (e.g., "Eco-Hub", $20k, "Zero Waste Office"). Click **Initialize Generation**.
- **Talking Points:**
    - "The **Loading State** isn't a spinner; it's a **Neural Pipeline Visualization**."
    - "It tells the user exactly what the AI is calibrating: metrics, products, and budget."

### 2. Deep Dive into the Proposal Canvas
- **Action:** Click through the tabs (**Overview**, **Products**, **Budget**, **Impact**).
- **Talking Points:**
    - **Overview:** "The AI generates a high-impact 'elevator pitch' automatically."
    - **Products:** "Every item is mathematically calculated to fit the budget perfectly."
    - **Fiscal Matrix (Budget):** "We show a visual breakdown of asset allocation so the client knows exactly where their money goes."
    - **Impact Tiles:** "The killer feature—hard metrics like 'Trees Planted Equivalent' to close the deal emotionally."

---

## 💻 Part 3: Under the Hood (The Code)
**Goal:** Explain the technical brilliance and where to start.

### 1. Where to Start: `src/app/page.js`
- **Explanation:** 
    - "This is the **Central Hub**. It manages the global state: generating status, error handling, and the active proposal."
    - "Notice the clean separation between the `ProposalForm` and `ProposalPreview`."

### 2. The AI Brain: `openaiService.js`
- **Key Logic:**
    - "The **System Prompt** is the secret sauce. It forces the AI to act as a 'Rayeva Sustainability Expert'."
    - "We use a **Strict JSON Schema** to ensure the app never crashes on bad AI formatting."
    - "We've added a **Thinking Block Filter** and **Validation Layer** to handle math drift and model-specific formatting."

### 3. The Design System: `globals.css`
- **Key Logic:**
    - "This is where the 'Rayeva Pulse' lives. We use **Tailwind @layer** directives to define premium components like `.glass-card` and `.bento-card`."
    - "The custom scrollbars and page transitions are all here, keeping the React components clean."

---

## 🛠️ Part 4: Technical Resilience
**Goal:** Mention the small details that make it "Real."

- **Structured Logging:** "Every single AI interaction is recorded in `/logs/ai-interactions.log` for full auditability."
- **PDF Export:** "Users can instantly export the canvas to a branded PDF using the `pdfExport.js` library."
- **Error Handling:** "If the AI fails or the budget is invalid, we have a custom **Engine Interrupt (ErrorState)** to guide the user back."

---

## 🏁 Conclusion
- "Rayeva isn't just generating text; it's generating **value**, **trust**, and **impact** in a package that looks as good as it works."
