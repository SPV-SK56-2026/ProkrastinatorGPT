'use strict';

require('dotenv').config();
const pool        = require('./db/db');
const users       = require('./db/repositories/UserRepository');
const assignments = require('./db/repositories/AssignmentRepository');
const responses   = require('./db/repositories/ResponseRepository');
const bugs        = require('./db/repositories/BugRepository');

async function test() {
  
  // USERS
  console.log('\n=== users.getAll() ===');
  console.log(await users.getAll());

  console.log('\n=== users.getById(1) ===');
  console.log(await users.getById(1));

  console.log('\n=== users.getByEmail("maja.horvat@student.uni-lj.si") ===');
  console.log(await users.getByEmail('maja.horvat@student.uni-lj.si'));

  console.log('\n=== users.getByUsername("luka_kovac") ===');
  console.log(await users.getByUsername('luka_kovac'));

  // ASSIGNMENTS
  console.log('\n=== assignments.getAll() ===');
  console.log(await assignments.getAll());

  console.log('\n=== assignments.getById(3) ===');
  console.log(await assignments.getById(3));

  console.log('\n=== assignments.getGroupProjects() ===');
  console.log(await assignments.getGroupProjects());

  console.log('\n=== assignments.getByDifficulty(8) ===');
  console.log(await assignments.getByDifficulty(8));

  // RESPONSES
  console.log('\n=== responses.getAll() ===');
  console.log(await responses.getAll());

  console.log('\n=== responses.getByUserId(1) ===');
  console.log(await responses.getByUserId(1));

  console.log('\n=== responses.getByAssignmentId(1) ===');
  console.log(await responses.getByAssignmentId(1));

  console.log('\n=== responses.getByUserAndAssignment(1, 2) ===');
  console.log(await responses.getByUserAndAssignment(1, 2));

  // BUGS
  console.log('\n=== bugs.getAll() ===');
  console.log(await bugs.getAll());

  console.log('\n=== bugs.getByUserId(2) ===');
  console.log(await bugs.getByUserId(2));

  console.log('\n=== bugs.getByStatus("open") ===');
  console.log(await bugs.getByStatus('open'));

  console.log('\n=== bugs.getByPriority("high") ===');
  console.log(await bugs.getByPriority('high'));

  pool.end();
}

test().catch(e => { console.error(e.message); pool.end(); });
