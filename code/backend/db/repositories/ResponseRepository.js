'use strict';

const pool = require('../db');
const BaseRepository = require('./BaseRepository');

const TABLE = 'responses';
const ALLOWED_COLUMNS = [
  'user_id',
  'assignment_id',
  'summary_text',
  'steps_text',
  'difficulty_assessment',
  'estimated_minutes',
];

class ResponseRepository extends BaseRepository {
  constructor() {
    super(TABLE, ALLOWED_COLUMNS);
  }

  async getByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM responses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getByAssignmentId(assignmentId) {
    const result = await pool.query(
      'SELECT * FROM responses WHERE assignment_id = $1 ORDER BY created_at DESC',
      [assignmentId]
    );
    return result.rows;
  }

  async getByUserAndAssignment(userId, assignmentId) {
    const result = await pool.query(
      'SELECT * FROM responses WHERE user_id = $1 AND assignment_id = $2',
      [userId, assignmentId]
    );
    return result.rows[0] || null;
  }
}

module.exports = new ResponseRepository();