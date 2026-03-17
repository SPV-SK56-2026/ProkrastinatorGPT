/* eslint-disable camelcase */
'use strict';

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'integer', primaryKey: true, identity: { always: true } },
    username: { type: 'varchar(100)', notNull: true, unique: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
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
  pgm.dropTable('users');
};
