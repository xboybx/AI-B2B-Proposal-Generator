import { NextResponse } from 'next/server';
import { generateProposal } from '@/services/openaiService';
import { logger } from '@/lib/logger';

/**
 * POST /api/generate-proposal
 * Generate a B2B proposal using OpenAI
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { clientName, totalBudget, sustainabilityGoals } = body;

    // Validate required fields
    if (!clientName || !totalBudget || !sustainabilityGoals) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: clientName, totalBudget, sustainabilityGoals',
        },
        { status: 400 }
      );
    }

    // Validate budget
    const budgetNum = parseFloat(totalBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid budget. Must be a positive number.',
        },
        { status: 400 }
      );
    }

    // Generate proposal
    const result = await generateProposal({
      clientName,
      totalBudget: budgetNum,
      sustainabilityGoals,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    logger.logError('API Generate Proposal Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
