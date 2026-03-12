/* eslint-disable camelcase */
'use strict';

exports.up = (pgm) => {
  pgm.createTable('assignments', {
    id: { type: 'integer', primaryKey: true, identity: { always: true } },
    title: { type: 'varchar(255)', notNull: true },
    explanation: { type: 'text' },
    difficulty: {
      type: 'integer',
      notNull: true,
      check: 'difficulty BETWEEN 1 AND 10',
    },
    estimated_minutes: {
      type: 'integer',
      notNull: true,
      check: 'estimated_minutes > 0',
    },
    is_group_project: { type: 'boolean', notNull: true, default: false },
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
};

exports.down = (pgm) => {
  pgm.dropTable('assignments');
};
