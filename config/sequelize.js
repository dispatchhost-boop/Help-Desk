const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Prefer .env if present
require('dotenv').config({ path: path.resolve(process.cwd(), './config.env') });

// Try to read config/config.json (sequelize-cli) as fallback
let cliCfg = {};
try {
  const raw = fs.readFileSync(path.resolve(process.cwd(), 'config/config.json'), 'utf8');
  cliCfg = JSON.parse(raw)[process.env.NODE_ENV || 'development'] || {};
} catch (_) { /* ignore */ }

// Final creds: ENV first, then config.json, then sensible defaults
const DB_NAME = process.env.DB_NAME || 'ds12aug';;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = '';
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT );


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
});

module.exports = sequelize;
