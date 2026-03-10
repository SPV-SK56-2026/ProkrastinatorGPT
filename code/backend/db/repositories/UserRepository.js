'use strict';

const pool = require('../db');
const BaseRepository = require('./BaseRepository');

const TABLE = 'users';
const ALLOWED_COLUMNS = ['username', 'email', 'password_hash'];

class UserRepository extends BaseRepository {
  constructor() {
    super(TABLE, ALLOWED_COLUMNS);
  }

  async getByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async getByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }
}

module.exports = new UserRepository();