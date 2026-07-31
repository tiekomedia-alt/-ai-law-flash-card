// LawFlash AI — Supabase Migration Runner (v2)
// Uses Supabase Management API to execute SQL directly
// Run: node supabase/run_migration.js

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > -1) {
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL: https://hjlzqandwglgxdbtsget.supabase.co
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '').split('.')[0];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Read SQL
const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

console.log('🏛️  LawFlash AI — Database Migration');
console.log('📡 Project:', projectRef);
console.log('⏳ Running schema...\n');

function makeRequest(hostname, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, ...options }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runMigration() {
  // Supabase provides a direct SQL execution via the REST API using the service role
  // The correct endpoint is POST to /rest/v1/ with raw SQL is not supported.
  // We use the Database Management API endpoint instead:
  // POST https://api.supabase.com/v1/projects/{ref}/database/query

  // First, let's try the simpler approach: use the Supabase anon REST API
  // to call a stored procedure, OR use the pg REST endpoint if available.
  
  // The most reliable approach for running migrations is via @supabase/supabase-js
  // using the service role key. Let's check if we can use the management API.

  const payload = JSON.stringify({ query: sql });

  // Try Supabase Management API
  const result = await makeRequest(
    'api.supabase.com',
    {
      port: 443,
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    },
    payload
  );

  console.log('Status:', result.status);
  
  if (result.status === 200 || result.status === 201) {
    console.log('✅ Migration successful!\n');
    printSummary();
  } else if (result.status === 401 || result.status === 403) {
    console.log('⚠️  Management API requires personal access token.');
    console.log('\n📋 MANUAL STEPS (takes 2 minutes):');
    console.log('1. Go to: https://supabase.com/dashboard/project/hjlzqandwglgxdbtsget/sql/new');
    console.log('2. Copy the SQL from: supabase/migrations/001_initial_schema.sql');
    console.log('3. Paste it in the SQL Editor and click "Run"');
    console.log('\nAlternatively, I can install @supabase/supabase-js to run this properly.');
    console.log('Run: npm init -y && npm install @supabase/supabase-js');
    console.log('Then: node supabase/run_migration_v3.js');
  } else {
    console.log('Response:', result.body.substring(0, 500));
  }
}

function printSummary() {
  console.log('📊 Tables ready:');
  [
    'users', 'subscriptions', 'courses (5 courses pre-loaded)', 
    'chapters', 'flashcards', 'mcq_questions',
    'user_progress', 'exam_attempts', 'streaks',
    'xp_transactions', 'leaderboard', 'content_reports',
    'documents', 'embeddings (pgvector)'
  ].forEach(t => console.log(`   ✅ ${t}`));
  console.log('\n🔐 RLS: Active on all tables');
  console.log('⚡ Trigger: Auto-create profile + streak on signup');
  console.log('🔍 Function: search_embeddings() for RAG vector search');
}

runMigration().catch(console.error);
