# Rayeva B2B Proposal Generator

An AI-powered B2B proposal generation module for Rayeva's sustainable commerce platform. This application uses OpenAI's GPT-4 to generate comprehensive sustainable product proposals with budget allocation and environmental impact metrics.

## Features

- 🤖 **AI-Powered Proposals**: Generate customized B2B proposals using OpenAI GPT-4
- 🌱 **Sustainable Products**: Curated eco-friendly product recommendations
- 💰 **Smart Budgeting**: AI-optimized budget allocation across categories
- 📊 **Impact Metrics**: Quantified environmental impact (plastic saved, carbon offset, etc.)
- 💾 **Local Storage**: Save proposals to local JSON database
- 📝 **Audit Logging**: Comprehensive logging of all AI interactions
- 🎨 **Modern UI**: Clean, responsive dashboard built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS 3.4
- **AI**: OpenAI Node.js SDK (GPT-4o)
- **Database**: Local JSON file (mock database)
- **Icons**: Lucide React

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
   - Sustainability Goals: Describe environmental objectives

2. **Click "Generate Proposal"**:
   - The AI will analyze your inputs
   - Wait for the proposal to be generated (typically 10-30 seconds)

3. **Review the Proposal**:
   - **Overview**: Summary of categories and key metrics
   - **Products**: Detailed product recommendations by category
   - **Budget**: Cost breakdown and allocation visualization
   - **Impact**: Environmental impact metrics

4. **Save the Proposal**:
   - Click "Save to Database" to store the proposal locally

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

## Configuration

### OpenAI Model

The application uses GPT-4o by default. To use a different model, edit `src/services/openaiService.js`:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4o', // Change to 'gpt-3.5-turbo' for lower cost
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

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ for Rayeva Sustainable Commerce Platform**
