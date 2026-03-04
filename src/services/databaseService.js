import fs from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROPOSALS_FILE = path.join(DATA_DIR, 'proposals.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize proposals file if it doesn't exist
if (!fs.existsSync(PROPOSALS_FILE)) {
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify([], null, 2));
}

/**
 * Database service for storing and retrieving proposals
 * Uses local JSON file as mock database
 */
export const databaseService = {
  /**
   * Save a proposal to the database
   * @param {object} proposal - The proposal to save
   * @returns {Promise<object>} - Saved proposal with ID
   */
  saveProposal: async (proposal) => {
    try {
      // Read existing proposals
      const proposals = await databaseService.getAllProposals();

      // Create new proposal with metadata
      const newProposal = {
        id: `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...proposal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };

      // Add to proposals array
      proposals.push(newProposal);

      // Write back to file
      fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));

      logger.log('database', {
        action: 'save',
        proposalId: newProposal.id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        data: newProposal,
      };
    } catch (error) {
      logger.logError('Database Save Error', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get all proposals
   * @returns {Promise<Array>} - Array of all proposals
   */
  getAllProposals: async () => {
    try {
      if (!fs.existsSync(PROPOSALS_FILE)) {
        return [];
      }

      const data = fs.readFileSync(PROPOSALS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.logError('Database Read Error', error);
      return [];
    }
  },

  /**
   * Get a proposal by ID
   * @param {string} id - Proposal ID
   * @returns {Promise<object|null>} - Proposal or null if not found
   */
  getProposalById: async (id) => {
    try {
      const proposals = await databaseService.getAllProposals();
      const proposal = proposals.find((p) => p.id === id);
      
      return proposal || null;
    } catch (error) {
      logger.logError('Database Get By ID Error', error);
      return null;
    }
  },

  /**
   * Update a proposal
   * @param {string} id - Proposal ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} - Updated proposal
   */
  updateProposal: async (id, updates) => {
    try {
      const proposals = await databaseService.getAllProposals();
      const index = proposals.findIndex((p) => p.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Proposal not found',
        };
      }

      proposals[index] = {
        ...proposals[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));

      logger.log('database', {
        action: 'update',
        proposalId: id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        data: proposals[index],
      };
    } catch (error) {
      logger.logError('Database Update Error', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Delete a proposal
   * @param {string} id - Proposal ID
   * @returns {Promise<object>} - Deletion result
   */
  deleteProposal: async (id) => {
    try {
      const proposals = await databaseService.getAllProposals();
      const filteredProposals = proposals.filter((p) => p.id !== id);

      if (filteredProposals.length === proposals.length) {
        return {
          success: false,
          error: 'Proposal not found',
        };
      }

      fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(filteredProposals, null, 2));

      logger.log('database', {
        action: 'delete',
        proposalId: id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Proposal deleted successfully',
      };
    } catch (error) {
      logger.logError('Database Delete Error', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Search proposals by client name
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Matching proposals
   */
  searchProposals: async (query) => {
    try {
      const proposals = await databaseService.getAllProposals();
      const lowerQuery = query.toLowerCase();

      return proposals.filter(
        (p) =>
          p.clientName?.toLowerCase().includes(lowerQuery) ||
          p.sustainabilityGoals?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      logger.logError('Database Search Error', error);
      return [];
    }
  },
};

export default databaseService;
