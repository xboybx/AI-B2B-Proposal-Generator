import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'ai-interactions.log');

// Ensure logs directory exists (optional, catch error for read-only filesystems)
try {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn(`[LOGGER] Could not create logs directory: ${e.message}`);
}

/**
 * Logger utility for auditing AI prompts and responses
 */
export const logger = {
  /**
   * Log AI prompt and response to file and console
   * @param {string} type - 'prompt' or 'response'
   * @param {object} data - The data to log
   */
  log: (type, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      data,
    };

    const logString = JSON.stringify(logEntry, null, 2);

    // Write to file (optional, handle read-only filesystems)
    try {
      fs.appendFileSync(LOG_FILE, `\n${'='.repeat(80)}\n${logString}\n`);
    } catch (e) {
      // Ignore write errors in production/serverless
    }

    // Also log to console
    console.log(`[${timestamp}] [${type.toUpperCase()}]:`, data);
  },

  /**
   * Log a prompt sent to OpenAI
   * @param {object} promptData - The prompt data
   */
  logPrompt: (promptData) => {
    logger.log('prompt', promptData);
  },

  /**
   * Log a response received from OpenAI
   * @param {object} responseData - The response data
   */
  logResponse: (responseData) => {
    logger.log('response', responseData);
  },

  /**
   * Log an error
   * @param {string} context - The context where error occurred
   * @param {Error} error - The error object
   */
  logError: (context, error) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'error',
      context,
      message: error.message,
      stack: error.stack,
    };

    const logString = JSON.stringify(logEntry, null, 2);
    try {
      fs.appendFileSync(LOG_FILE, `\n${'='.repeat(80)}\n${logString}\n`);
    } catch (e) {
      // Ignore write errors
    }
    console.error(`[${timestamp}] [ERROR] [${context}]:`, error);
  },

  /**
   * Get all logs
   * @returns {string} - All log contents
   */
  getLogs: () => {
    if (fs.existsSync(LOG_FILE)) {
      return fs.readFileSync(LOG_FILE, 'utf-8');
    }
    return '';
  },

  /**
   * Clear all logs
   */
  clearLogs: () => {
    try {
      if (fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '');
      }
    } catch (e) {
      // Ignore
    }
  },
};

export default logger;
