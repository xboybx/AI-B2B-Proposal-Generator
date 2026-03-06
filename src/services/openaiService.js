import OpenAI from 'openai';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-OpenRouter-Title': 'Rayeva B2B Proposal Generator',
  },
});

// --- ZOD SCHEMA DEFINITION ---
const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.coerce.number(),
  unitPrice: z.coerce.number(),
  totalPrice: z.coerce.number(),
  sustainabilityFeature: z.string(),
});

const ProposalSchema = z.object({
  clientName: z.string(),
  totalBudget: z.coerce.number(),
  sustainabilityGoals: z.string(),
  productMix: z.array(z.object({
    category: z.string(),
    products: z.array(ProductSchema)
  })),
  budgetAllocation: z.record(z.string(), z.coerce.number()),
  costBreakdown: z.array(z.object({
    category: z.string(),
    allocatedAmount: z.coerce.number(),
    percentageOfBudget: z.coerce.number()
  })),
  impactPositioningSummary: z.object({
    plasticSavedKg: z.coerce.number().optional(),
    carbonOffsetKg: z.coerce.number().optional(),
    treesEquivalent: z.coerce.number().optional(),
    waterSavedLiters: z.coerce.number().optional(),
    keyMessage: z.string()
  }),
  timeline: z.string().optional(),
  notes: z.string().optional()
});

/**
 * System prompt for the B2B Proposal Generator
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
4. The 'keyMessage' must be a persuasive, professional 2-3 sentence executive summary that explains how the recommended products solve the client's specific sustainability challenges.
5. Output RAW JSON ONLY. No markdown, no 'think' tags in output.`;

/**
 * Generate a B2B proposal using OpenAI
 */
export async function generateProposal({ clientName, totalBudget, sustainabilityGoals }) {
  try {
    if (!clientName || !totalBudget || !sustainabilityGoals) {
      throw new Error('Missing required inputs: clientName, totalBudget, sustainabilityGoals');
    }

    const userPrompt = `Generate a sustainable B2B proposal for:
Client: ${clientName}
Budget: $${totalBudget} USD
Goals: ${sustainabilityGoals}
Provide a comprehensive proposal with product recommendations and impact metrics.`;

    logger.logPrompt({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      timestamp: new Date().toISOString(),
    });

    let proposalData;
    let lastError;
    let content = '';
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
          max_tokens: 4000
        });

        const choice = response.choices[0];
        content = choice?.message?.content || choice?.message?.reasoning || '';

        if (!content || content.trim().length === 0) {
          throw new Error('AI returned an empty response');
        }

        logger.logResponse({
          rawContent: content,
          model: response.model,
          usage: response.usage,
          timestamp: new Date().toISOString(),
        });

        let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error('No JSON object found in response');
        }

        const rawJson = JSON.parse(jsonMatch[0].trim());

        // --- ZOD VALIDATION ---
        proposalData = ProposalSchema.parse(rawJson);

        // Optional: Custom budget check
        let totalAllocated = 0;
        proposalData.productMix.forEach(cat => {
          cat.products.forEach(p => totalAllocated += p.totalPrice);
        });

        if (totalAllocated > totalBudget * 1.1) {
          throw new Error(`AI exceeded budget significantly ($${totalAllocated.toFixed(2)} vs $${totalBudget})`);
        }

        return {
          success: true,
          data: proposalData,
          rawResponse: content,
        };

      } catch (err) {
        lastError = err;
        console.warn(`[RETRY ENGINE] Attempt ${attempt} failed: ${err.message}`);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    throw new Error(`All generation attempts failed. Last error: ${lastError.message}`);

  } catch (error) {
    logger.logError('Fatal Generate Proposal Error', error);
    return {
      success: false,
      error: error instanceof z.ZodError
        ? "AI output failed structural validation. Key missing or invalid format."
        : error.message,
    };
  }
}

/**
 * Test Connection
 */
export async function testConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10,
    });
    return { success: true, model: response.model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default { generateProposal, testConnection };
