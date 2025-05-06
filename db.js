// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'jarvis',
  host: '192.168.80.38',
  database: 'development',
  password: '2650',
  port: 5555,
});

module.exports = pool;
