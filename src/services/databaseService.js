import { logger } from '@/lib/logger';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.MONGODB_DB_NAME || 'rayeva';
const COLLECTION_NAME = 'proposals';

/**
 * Database service for storing and retrieving proposals
 * Uses MongoDB for persistence
 */
export const databaseService = {
  /**
   * Get the database collection
   */
  getCollection: async () => {
    const client = await clientPromise;
    return client.db(DB_NAME).collection(COLLECTION_NAME);
  },

  /**
   * Save a proposal to the database
   * @param {object} proposal - The proposal to save
   * @returns {Promise<object>} - Saved proposal with ID
   */
  saveProposal: async (proposal) => {
    try {
      const collection = await databaseService.getCollection();

      // Create new proposal with metadata
      const newProposal = {
        ...proposal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };

      const result = await collection.insertOne(newProposal);

      const savedProposal = {
        ...newProposal,
        id: result.insertedId.toString(),
      };

      logger.log('database', {
        action: 'save',
        proposalId: savedProposal.id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        data: savedProposal,
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
      const collection = await databaseService.getCollection();
      const proposals = await collection.find({}).sort({ createdAt: -1 }).toArray();

      return proposals.map(p => ({
        ...p,
        id: p._id.toString(),
        _id: undefined
      }));
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
      const collection = await databaseService.getCollection();
      const proposal = await collection.findOne({ _id: new ObjectId(id) });

      if (!proposal) return null;

      return {
        ...proposal,
        id: proposal._id.toString(),
        _id: undefined
      };
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
      const collection = await databaseService.getCollection();

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return {
          success: false,
          error: 'Proposal not found',
        };
      }

      logger.log('database', {
        action: 'update',
        proposalId: id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        data: {
          ...result,
          id: result._id.toString(),
          _id: undefined
        },
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
      const collection = await databaseService.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return {
          success: false,
          error: 'Proposal not found',
        };
      }

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
      const collection = await databaseService.getCollection();
      const lowerQuery = query.toLowerCase();

      const proposals = await collection.find({
        $or: [
          { clientName: { $regex: lowerQuery, $options: 'i' } },
          { sustainabilityGoals: { $regex: lowerQuery, $options: 'i' } }
        ]
      }).toArray();

      return proposals.map(p => ({
        ...p,
        id: p._id.toString(),
        _id: undefined
      }));
    } catch (error) {
      logger.logError('Database Search Error', error);
      return [];
    }
  },
};

export default databaseService;
