import { NextResponse } from 'next/server';
import { testConnection } from '@/services/openaiService';

/**
 * GET /api/test-connection
 * Test the OpenAI API connection
 */
export async function GET() {
  try {
    const result = await testConnection();

    // Test MongoDB connection
    let mongodbStatus = { success: false, message: 'Not tested' };
    try {
      const { databaseService } = require('@/services/databaseService');
      await databaseService.getCollection();
      mongodbStatus = { success: true, message: 'Connected' };
    } catch (dbError) {
      mongodbStatus = { success: false, message: dbError.message };
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'OpenAI connection failed. Please check your API key.',
          mongodb: mongodbStatus
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      model: result.model,
      mongodb: mongodbStatus
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
