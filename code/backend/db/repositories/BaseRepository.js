'use strict';

const pool = require('../db');

class BaseRepository {
  /**
   * @param {string} tableName
   * @param {string[]} allowedColumns
   */
  constructor(tableName, allowedColumns) {
    this.tableName = tableName;
    this.allowedColumns = allowedColumns;
  }

  async getAll() {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} ORDER BY id`
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const filtered = this._filterColumns(data);
    const columns = Object.keys(filtered);
    const values = Object.values(filtered);

    if (columns.length === 0) {
      throw new Error('No valid columns provided for create()');
    }

    const columnList = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      INSERT INTO ${this.tableName} (${columnList})
      VALUES (${placeholders})
      RETURNING *
    `;
    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  async update(id, data) {
    const filtered = this._filterColumns(data);
    const columns = Object.keys(filtered);
    const values = Object.values(filtered);

    if (columns.length === 0) {
      throw new Error('No valid columns provided for update()');
    }

    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
    values.push(id);

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;
    const result = await pool.query(sql, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  _filterColumns(data) {
    const filtered = {};
    for (const key of this.allowedColumns) {
      if (data[key] !== undefined) {
        filtered[key] = data[key];
      }
    }
    return filtered;
  }
}

module.exports = BaseRepository;