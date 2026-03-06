import { NextResponse } from 'next/server';
import { databaseService } from '@/services/databaseService';
import { logger } from '@/lib/logger';

/**
 * POST /api/save-proposal
 * Save a proposal to the database
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { proposal } = body;

    // Validate required fields
    if (!proposal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: proposal',
        },
        { status: 400 }
      );
    }

    // Validate proposal has required data
    if (!proposal.clientName || !proposal.totalBudget) {
      return NextResponse.json(
        {
          success: false,
          error: 'Proposal must include clientName and totalBudget',
        },
        { status: 400 }
      );
    }

    // Save to database
    const result = await databaseService.saveProposal(proposal);

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
    logger.logError('API Save Proposal Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/save-proposal
 * Get all saved proposals
 */
export async function GET() {
  try {
    const proposals = await databaseService.getAllProposals();

    return NextResponse.json({
      success: true,
      data: proposals,
    });

  } catch (error) {
    logger.logError('API Get Proposals Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/save-proposal
 * Delete a proposal by ID
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: id',
        },
        { status: 400 }
      );
    }

    const result = await databaseService.deleteProposal(id);

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
    logger.logError('API Delete Proposal Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
