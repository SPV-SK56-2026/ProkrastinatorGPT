'use strict';

const pool = require('../db');
const BaseRepository = require('./BaseRepository');

const TABLE = 'assignments';
const ALLOWED_COLUMNS = [
  'title',
  'explanation',
  'difficulty',
  'estimated_minutes',
  'is_group_project',
];

class AssignmentRepository extends BaseRepository {
  constructor() {
    super(TABLE, ALLOWED_COLUMNS);
  }

  async getGroupProjects() {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE is_group_project = TRUE ORDER BY id'
    );
    return result.rows;
  }

  async getByDifficulty(difficulty) {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE difficulty = $1 ORDER BY id',
      [difficulty]
    );
    return result.rows;
  }
}

module.exports = new AssignmentRepository();