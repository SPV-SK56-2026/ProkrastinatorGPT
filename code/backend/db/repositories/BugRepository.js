'use strict';

const pool = require('../db');
const BaseRepository = require('./BaseRepository');

const TABLE = 'bugs';
const ALLOWED_COLUMNS = [
  'user_id',
  'title',
  'description',
  'status',
  'priority',
];

class BugRepository extends BaseRepository {
  constructor() {
    super(TABLE, ALLOWED_COLUMNS);
  }

  async getByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM bugs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getByStatus(status) {
    const result = await pool.query(
      'SELECT * FROM bugs WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  }

  async getByPriority(priority) {
    const result = await pool.query(
      'SELECT * FROM bugs WHERE priority = $1 ORDER BY created_at DESC',
      [priority]
    );
    return result.rows;
  }
}

module.exports = new BugRepository();