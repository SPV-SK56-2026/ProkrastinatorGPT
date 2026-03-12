/* eslint-disable camelcase */
'use strict';

exports.up = (pgm) => {
  pgm.createTable('responses', {
    id: { type: 'integer', primaryKey: true, identity: { always: true } },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    assignment_id: {
      type: 'integer',
      notNull: true,
      references: '"assignments"',
      onDelete: 'CASCADE',
    },
    summary_text: { type: 'text' },
    steps_text: { type: 'text' },
    difficulty_assessment: {
      type: 'integer',
      check: 'difficulty_assessment BETWEEN 1 AND 10',
    },
    estimated_minutes: {
      type: 'integer',
      check: 'estimated_minutes > 0',
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
  },
  {
    constraints: {
      uq_response_user_assignment: { unique: ['user_id', 'assignment_id'] },
    },
  });

  pgm.createIndex('responses', 'user_id');
  pgm.createIndex('responses', 'assignment_id');
};

exports.down = (pgm) => {
  pgm.dropTable('responses');
};
