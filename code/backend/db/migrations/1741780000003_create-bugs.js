/* eslint-disable camelcase */
'use strict';

exports.up = (pgm) => {
  pgm.createTable('bugs', {
    id: { type: 'integer', primaryKey: true, identity: { always: true } },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: "'open'",
      check: "status IN ('open', 'in_progress', 'resolved', 'closed')",
    },
    priority: {
      type: 'varchar(10)',
      notNull: true,
      default: "'medium'",
      check: "priority IN ('low', 'medium', 'high')",
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('bugs', 'user_id');
  pgm.createIndex('bugs', 'status');
};

exports.down = (pgm) => {
  pgm.dropTable('bugs');
};
