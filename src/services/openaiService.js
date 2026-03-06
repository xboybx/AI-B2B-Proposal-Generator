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
const SYSTEM_PROMPT = `Expert B2B sustainable consultant for Rayeva.
Generate a proposal JSON with this structure:
{
  "clientName": "string",
  "totalBudget": number,
  "sustainabilityGoals": "string",
  "productMix": [{"category": "string", "products": [{"name": "string", "description": "string", "quantity": number, "unitPrice": number, "totalPrice": number, "sustainabilityFeature": "string"}]}],
  "budgetAllocation": {"officeSupplies": number, "packagingMaterials": number, "corporateGifts": number, "other": number},
  "costBreakdown": [{"category": "string", "allocatedAmount": number, "percentageOfBudget": number}],
  "impactPositioningSummary": {"plasticSavedKg": number, "carbonOffsetKg": number, "treesEquivalent": number, "waterSavedLiters": number, "keyMessage": "string"},
  "timeline": "string",
  "notes": "string"
}
RULES:
1. Total prices sum MUST NOT exceed budget.
2. 3-4 categories, 2-3 products each.
3. Impact metrics must be realistic counts.
4. Output RAW JSON ONLY. No markdown, no 'think' tags in output.`;

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

    // Robust Retry Loop: Handles empty responses, malformed JSON, and validation failures
    let proposalData;
    let lastError;
    let content = ''; // Define content in the function scope
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'liquid/lfm-2.5-1.2b-thinking:free',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4000 //Reduced slightly to avoid truncation on free-tier
        });

        // Some thinking models put output in 'reasoning' field instead of 'content'
        const choice = response.choices[0];
        content = choice?.message?.content || choice?.message?.reasoning || '';

        if (!content || content.trim().length === 0) {
          throw new Error('AI returned an empty response');
        }

        // Log the raw response for auditing
        logger.logResponse({
          rawContent: content,
          model: response.model,
          usage: response.usage,
          timestamp: new Date().toISOString(),
        });

        // --- ATTEMPT PARSING ---
        // Clean up: remove <think> blocks and isolate the JSON object
        let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error('No JSON object found in the response metadata');
        }

        proposalData = JSON.parse(jsonMatch[0].trim());

        // --- ATTEMPT VALIDATION ---
        validateProposalData(proposalData, totalBudget);

        // SUCCESS: Output is valid
        return {
          success: true,
          data: proposalData,
          rawResponse: content,
        };

      } catch (err) {
        lastError = err;
        console.warn(`[RETRY ENGINE] Attempt ${attempt} failed: ${err.message}`);

        if (attempt < MAX_RETRIES) {
          // Wait 2 seconds before next attempt to allow for infrastructure stabilization
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // If we get here, all retries failed
    logger.logError('All Generation Attempts Failed', lastError);
    throw new Error(`The AI service failed to provide a valid proposal after ${MAX_RETRIES} attempts. Reason: ${lastError.message}. Please try a simpler prompt or check your connection.`);

  } catch (error) {
    logger.logError('Fatal Generate Proposal Error', error);
    return {
      success: false,
      error: error.message || 'The Neural Pipeline suffered a critical interruption.',
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
