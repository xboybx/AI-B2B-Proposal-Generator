import { NextResponse } from 'next/server';
import { testConnection } from '@/services/openaiService';

/**
 * GET /api/test-connection
 * Test the OpenAI API connection
 */
export async function GET() {
  try {
    const result = await testConnection();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'OpenAI connection failed. Please check your API key.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      model: result.model,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to test OpenAI connection',
      },
      { status: 500 }
    );
  }
}
