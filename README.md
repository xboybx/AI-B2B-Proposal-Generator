# Rayeva B2B Proposal Generator

## 🏗️ Architecture Overview

The Rayeva B2B Proposal Generator is built with a modern, scalable stack designed for real-time AI interactions and premium user experiences.

### 1. **Core Framework**
- **Next.js (App Router)**: Powers the entire application, utilizing both Client and Server Components for optimal performance and SEO.
- **Tailwind CSS**: A customized design system built on utility-first principles, featuring modern glassmorphism and bento-grid layouts.

### 2. **AI Service Layer**
- **OpenAI SDK / OpenRouter**: The "brain" of the app. It uses advanced thinking models (like Liquid LFM) to interpret client requirements and generate structured JSON proposals.
- **Service-Oriented Architecture**: All AI logic is encapsulated in `@/services/openaiService.js`, keeping the API routes clean and maintainable.

### 3. **Data & Persistence**
- **Next.js API Routes**: Serverless functions handle proposal generation, storage, and retrieval.
- **Structured Logging**: A custom logger tracks every AI transaction (prompts, raw responses, usage metrics) for transparency and debugging.

### 4. **Export Engine**
- **PDF Generation**: Uses `jspdf` to transform the digital canvas into professional, branded documents for offline distribution.

---

## 🧠 AI Prompt Design Strategy

The generation engine uses a sophisticated "Constrained Creativity" prompt structure to ensure accuracy and professionalism.

### **The Persona**
The AI is instructed to act as a **"Rayeva Sustainability Expert."** This ensures the tone is professional, authoritative, and focused on business value rather than generic "green" advice.

### **Structural Enforcement**
We use a **System Prompt** that defines a strict JSON schema. This guarantees:
- **Mathematical Consistency**: The AI performs real-time calculations to ensure product totals never exceed the client's budget.
- **Category Strategy**: The AI is forced to distribute spend across at least 3-4 distinct B2B categories (e.g., Office Supplies, Corporate Gifts).

### **Quantifiable Impact**
The prompt specifically requests environmental metrics (Plastic, Carbon, Water, Trees). The AI uses internal heuristics to estimate these based on the products it selects, providing the "hard numbers" needed to close B2B deals.

### **Post-Processing**
The application includes a logic layer that:
1. Strips internal "reasoning" or "thinking" blocks from the model.
2. Validates JSON integrity before it touches the UI.
3. Automatically fixes or ignores minor mathematical drift common in LLMs.

---

An AI-powered B2B proposal generation module for Rayeva's sustainable commerce platform. This application uses OpenAI's GPT-4 to generate comprehensive sustainable product proposals with budget allocation and environmental impact metrics.

## Features

- 🤖 **AI-Powered Proposals**: Generate customized B2B proposals using advanced Reasoning Models via OpenRouter
- ✍️ **Strategic Executive Summaries**: AI-driven persuasive narratives that justify investments based on specific client goals
- 🌱 **Sustainable Products**: Curated eco-friendly product recommendations with verifiable green features
- 💰 **Smart Budgeting**: AI-optimized budget allocation with clear progress tracking and unallocated fund monitoring
- 📊 **Impact Metrics**: Quantified sustainability metrics (plastic saved, carbon offset, trees equivalent)
- 💾 **Cloud Library**: Modular "Saved Proposals" management with real-time database synchronization
- 📝 **Audit Logging**: Comprehensive logging of prompts, raw responses, and token usage in `/logs`
- 📱 **Mobile-First Responsive Design**: Specialized layouts for devices below 654px and 320px with intelligent tab switching
- 📄 **Professional Exports**: One-click PDF generation for client-ready documents

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Design System**: Rayeva Pulse 2026 (Custom CSS + Tailwind)
- **Responsive Layout**: Multi-breakpoint system (down to 320px) with adaptive UI components
- **AI Infrastructure**: OpenAI SDK integrated with **OpenRouter.ai**
- **Model**: Liquid LFM (Reasoning/Thinking) for superior logic
- **Exporting**: jsPDF for high-fidelity document generation
- **Database**: Local JSON persistence with audit capabilities
- **Icons**: SVG Path Animations and customized Lucide-based icons

## Project Structure

```
rayeva-b2b-proposal-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-proposal/    # API route for AI generation
│   │   │   ├── save-proposal/        # API route for saving proposals
│   │   │   └── test-connection/      # API route for testing OpenAI
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── ProposalForm.js           # Input form component
│   │   ├── ProposalPreview.js        # Proposal display component
│   │   ├── LoadingState.js           # Loading overlay
│   │   ├── ErrorState.js             # Error display
│   │   └── SuccessNotification.js    # Success toast
│   ├── services/
│   │   ├── openaiService.js          # OpenAI integration logic
│   │   └── databaseService.js        # Database operations
│   ├── lib/
│   │   └── logger.js                 # Audit logging utility
│   └── data/
│       └── proposals.json            # Local proposal storage
├── logs/
│   └── ai-interactions.log           # AI prompt/response logs
├── .env.local                        # Environment variables (create this)
├── .env.local.example                # Example environment file
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── package.json
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### 2. Installation

```bash
# Navigate to the project directory
cd rayeva-b2b-proposal-generator

# Install dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Running the Application

```bash
# Start the development server
npm run dev

# Open your browser and navigate to
http://localhost:3000
```

### 5. Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Usage Guide

### Generating a Proposal

1. **Enter Client Information**:
   - Client Name: Company or organization name
   - Total Budget: Available budget in USD
   - Sustainability Goals: Describe environmental objectives (e.g., "Reduce carbon footprint")

2. **Click "Initialize Generation"**:
   - The AI will analyze your inputs and calculate optimal allocations.
   - On mobile devices, the UI will automatically switch to the **Preview Tab** once generation begins.

3. **Review the Proposal Canvas**:
   - **Overview**: Persuasive executive summaries and high-level statistics.
   - **Products**: Detailed recommendations with specific sustainability features.
   - **Budget**: Visual breakdown of **Budget Allocation Progress** and **Available Funds**.
   - **Impact**: Quantified metrics and **Verified Sustainability** trust IDs.

4. **Secure to Cloud**:
   - Click "Secure to Cloud" (icon-only on mobile) to store the proposal.
   - Click "Export" to download a professional PDF copy.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-proposal` | POST | Generate AI proposal |
| `/api/save-proposal` | POST | Save proposal to database |
| `/api/save-proposal` | GET | Get all saved proposals |
| `/api/test-connection` | GET | Test OpenAI connection |

### Request/Response Format

**Generate Proposal Request:**
```json
{
  "clientName": "GreenTech Solutions Inc.",
  "totalBudget": 50000,
  "sustainabilityGoals": "Reduce plastic waste by 50%"
}
```

**Generate Proposal Response:**
```json
{
  "success": true,
  "data": {
    "clientName": "GreenTech Solutions Inc.",
    "totalBudget": 50000,
    "productMix": [...],
    "budgetAllocation": {...},
    "costBreakdown": [...],
    "impactPositioningSummary": {...}
  }
}
```

## AI Model Configuration

The application is configured to use OpenRouter.ai to access state-of-the-art Reasoning models. To change the model, edit `src/services/openaiService.js`:

```javascript
const response = await openai.chat.completions.create({
  model: 'liquid/lfm-2.5-1.2b-thinking:free', // Replace with 'openai/gpt-4o' etc.
  // ...
});
```

### Logging

All AI interactions are logged to `logs/ai-interactions.log`. The logger utility is in `src/lib/logger.js`.

### Database

Proposals are stored in `src/data/proposals.json`. To use MongoDB instead:

1. Set the `MONGODB_URI` in `.env.local`
2. Update `src/services/databaseService.js` to use MongoDB client

## Troubleshooting

### OpenAI API Errors

- **Error**: "Invalid API key"
  - **Solution**: Verify your `OPENAI_API_KEY` in `.env.local`

- **Error**: "Rate limit exceeded"
  - **Solution**: Wait a moment and try again, or upgrade your OpenAI plan

- **Error**: "Model not found"
  - **Solution**: Ensure you have access to the specified model (GPT-4o)

### Application Errors

- **Error**: "Failed to parse AI response"
  - **Solution**: The AI may have returned invalid JSON. Try again with clearer inputs.

- **Error**: "Budget exceeded"
  - **Solution**: The AI allocated more than the budget. This is rare; try regenerating.

## Development

### Adding New Features

1. **New API Routes**: Add to `src/app/api/`
2. **New Components**: Add to `src/components/`
3. **New Services**: Add to `src/services/`

### Code Style

- Use ES6+ features
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Add JSDoc comments for functions

## Security Considerations

- Never commit `.env.local` to version control
- Keep your OpenAI API key secure
- The application uses server-side API routes to protect API keys
- Input validation is performed on both client and server


---

**This is a POC task developed by Jeswanth**
