#!/usr/bin/env node

/**
 * CREATE FIREBASE USER ACCOUNT (Simple CLI)
 * 
 * Creates a Firebase Auth user, basic Firestore doc, and initializes stats.
 * 
 * Usage:
 *   node scripts/quick-user.cjs --email test@example.com --username TestUser --password Pass123!
 *   node scripts/quick-user.cjs --interactive
 */

const https = require('https');
const readline = require('readline');
const { URL } = require('url');

const PROJECT_ID = 'genesis-protocol-bffc2';
const API_KEY = 'AIzaSyCmADcsf_WqfN9yJ0sC4zXaTTrxfoHjXDA';
const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
const INIT_STATS_URL = 'https://us-central1-genesis-protocol-bffc2.cloudfunctions.net/initializeStatsFromBaseline';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = (msg, color = 'reset') => console.log(`${colors[color]}${msg}${colors.reset}`);
const success = (msg) => log(`✅ ${msg}`, 'green');
const error = (msg) => log(`❌ ${msg}`, 'red');
const info = (msg) => log(`ℹ️  ${msg}`, 'blue');
const warn = (msg) => log(`⚠️  ${msg}`, 'yellow');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUsername(username) {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username);
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('min 8 chars');
  if (!/[A-Z]/.test(password)) errors.push('1 uppercase');
  if (!/[a-z]/.test(password)) errors.push('1 lowercase');
  if (!/[0-9]/.test(password)) errors.push('1 number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('1 special char');
  return { valid: errors.length === 0, errors };
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function httpsRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  try {
    const args = process.argv.slice(2);
    let email = '', username = '', password = '', interactive = false;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email') email = args[++i];
      else if (args[i] === '--username') username = args[++i];
      else if (args[i] === '--password') password = args[++i];
      else if (args[i] === '--interactive') interactive = true;
    }

    if (interactive || (!email && !username && !password)) {
      console.log();
      info('🔐 Firebase User Account Creation');
      console.log();

      while (!email || !validateEmail(email)) {
        email = await prompt('Email: ');
        if (!validateEmail(email)) error('Invalid email');
      }

      while (!username || !validateUsername(username)) {
        username = await prompt('Username (3-30 chars, alphanumeric, -, _): ');
        if (!validateUsername(username)) error('Invalid username');
      }

      while (!password) {
        password = await prompt('Password (min 8 chars, 1 upper, 1 lower, 1 number, 1 special): ');
        const val = validatePassword(password);
        if (!val.valid) {
          error('Password requirements: ' + val.errors.join(', '));
          password = '';
        }
      }
    } else if (!email || !username || !password) {
      error('Missing required arguments');
      process.exit(1);
    } else {
      if (!validateEmail(email)) { error('Invalid email'); process.exit(1); }
      if (!validateUsername(username)) { error('Invalid username'); process.exit(1); }
      const val = validatePassword(password);
      if (!val.valid) { error('Password: ' + val.errors.join(', ')); process.exit(1); }
    }

    console.log();
    info('Creating Firebase Auth user...');

    const authResp = await httpsRequest(`${AUTH_URL}?key=${API_KEY}`, 'POST', {
      email,
      password,
      returnSecureToken: true,
    });

    if (!authResp.localId) {
      throw new Error('Auth failed: ' + (authResp.error?.message || 'unknown'));
    }

    const uid = authResp.localId;
    success(`Auth user created: ${uid}`);

    info('Initializing stats from baseline...');
    const initResp = await httpsRequest(INIT_STATS_URL, 'POST', { uid, email });

    if (initResp.error) {
      error(`Stats init failed: ${initResp.error}`);
      process.exit(1);
    }

    success('Stats initialized');

    console.log();
    success('Account created successfully!');
    console.log();
    info('📊 User Details:');
    console.log(`   UID:      ${uid}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Username: ${username}`);
    if (initResp.summaryByCategory) {
      console.log();
      info('📈 Initial Stats:');
      Object.entries(initResp.summaryByCategory).forEach(([stat, value]) => {
        console.log(`   ${stat.padEnd(12)}: ${value}`);
      });
    }
    console.log();
    info('✨ User ready to log in!');
    console.log();

    process.exit(0);
  } catch (e) {
    console.log();
    error(`Error: ${e.message}`);
    console.log();
    process.exit(1);
  }
}

main();
