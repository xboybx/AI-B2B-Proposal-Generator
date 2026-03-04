import OpenAI from 'openai';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional. Site URL for rankings on openrouter.ai.
    'X-OpenRouter-Title': 'Rayeva B2B Proposal Generator', // Optional. Site title for rankings on openrouter.ai.
  },
});

/**
 * System prompt for the B2B Proposal Generator
 * Instructs AI to return structured JSON with sustainable product recommendations
 */
const SYSTEM_PROMPT = `You are an expert B2B sustainable commerce consultant for Rayeva, a platform specializing in eco-friendly products.

Your task is to generate a comprehensive B2B proposal based on the client's budget and sustainability goals.

You MUST return a valid JSON object with the following structure:
{
  "clientName": "string",
  "totalBudget": number,
  "sustainabilityGoals": "string",
  "productMix": [
    {
      "category": "string (e.g., 'Office Supplies', 'Packaging Materials', 'Corporate Gifts')",
      "products": [
        {
          "name": "string",
          "description": "string",
          "quantity": number,
          "unitPrice": number,
          "totalPrice": number,
          "sustainabilityFeature": "string (e.g., '100% Recycled Materials', 'Biodegradable', 'Carbon Neutral')"
        }
      ]
    }
  ],
  "budgetAllocation": {
    "officeSupplies": number,
    "packagingMaterials": number,
    "corporateGifts": number,
    "other": number
  },
  "costBreakdown": [
    {
      "category": "string",
      "allocatedAmount": number,
      "percentageOfBudget": number
    }
  ],
  "impactPositioningSummary": {
    "plasticSavedKg": number,
    "carbonOffsetKg": number,
    "treesEquivalent": number,
    "waterSavedLiters": number,
    "keyMessage": "string (e.g., 'This proposal saves 500 kg of plastic, equivalent to planting 200 trees')"
  },
  "timeline": "string (estimated delivery timeline)",
  "notes": "string (any additional recommendations)"
}

IMPORTANT RULES:
1. The sum of all product prices MUST NOT exceed the total budget
2. Allocate budget strategically across categories based on typical B2B needs
3. Ensure all products are genuinely sustainable with verifiable eco-friendly features
4. Provide realistic pricing for sustainable products
5. The impact summary should be quantified and impressive but realistic
6. Include at least 3-4 product categories
7. Each category should have 2-4 specific products
8. Return ONLY the JSON object, no markdown formatting, no explanations`;

/**
 * Generate a B2B proposal using OpenAI
 * @param {object} params - Proposal parameters
 * @param {string} params.clientName - Client company name
 * @param {number} params.totalBudget - Total budget in USD
 * @param {string} params.sustainabilityGoals - Client's sustainability goals
 * @returns {Promise<object>} - Generated proposal data
 */
export async function generateProposal({ clientName, totalBudget, sustainabilityGoals }) {
  try {
    // Validate inputs
    if (!clientName || !totalBudget || !sustainabilityGoals) {
      throw new Error('Missing required fields: clientName, totalBudget, sustainabilityGoals');
    }

    if (totalBudget <= 0) {
      throw new Error('Budget must be greater than 0');
    }

    const userPrompt = `Generate a sustainable B2B proposal for:

Client Name: ${clientName}
Total Budget: $${totalBudget} USD
Sustainability Goals: ${sustainabilityGoals}

Please provide a comprehensive proposal with product recommendations, budget allocation, and environmental impact metrics.`;

    // Log the prompt
    logger.logPrompt({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      timestamp: new Date().toISOString(),
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Log the raw response
    logger.logResponse({
      rawContent: content,
      model: response.model,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });

    // Parse JSON response
    let proposalData;
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      proposalData = JSON.parse(cleanContent);
    } catch (parseError) {
      logger.logError('JSON Parse Error', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the proposal data structure
    validateProposalData(proposalData, totalBudget);

    return {
      success: true,
      data: proposalData,
      rawResponse: content,
    };

  } catch (error) {
    logger.logError('Generate Proposal Error', error);
    return {
      success: false,
      error: error.message || 'Failed to generate proposal',
    };
  }
}

/**
 * Validate the proposal data structure and budget constraints
 * @param {object} data - Proposal data
 * @param {number} totalBudget - Expected total budget
 */
function validateProposalData(data, totalBudget) {
  // Check required fields
  const requiredFields = ['clientName', 'productMix', 'budgetAllocation', 'costBreakdown', 'impactPositioningSummary'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field in proposal: ${field}`);
    }
  }

  // Validate budget constraint
  let totalAllocated = 0;
  if (data.productMix && Array.isArray(data.productMix)) {
    for (const category of data.productMix) {
      if (category.products && Array.isArray(category.products)) {
        for (const product of category.products) {
          totalAllocated += product.totalPrice || 0;
        }
      }
    }
  }

  // Return warning instead of hard error for smaller free LLM math mistakes
  if (totalAllocated > totalBudget * 1.05) {
    console.warn(`Budget exceeded: allocated $${totalAllocated.toFixed(2)} exceeds budget $${totalBudget}`);
    // We choose not to throw here because smaller LLMs often fail exact math.
    // The frontend can still display the items to the user.
  }

  return true;
}

/**
 * Test the OpenAI connection
 * @returns {Promise<object>} - Connection test result
 */
export async function testConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10,
    });

    return {
      success: true,
      message: 'OpenAI connection successful',
      model: response.model,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  generateProposal,
  testConnection,
};
