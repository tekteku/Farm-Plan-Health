/**
 * Switch API Script
 * Run this to switch between mock and real Supabase API
 * 
 * Usage:
 * node switch-api.js mock    // Use mock data (development)
 * node switch-api.js supabase // Use real Supabase (testing/production)
 */

const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'supabase';

if (mode !== 'mock' && mode !== 'supabase') {
  console.error('❌ Invalid mode. Use: node switch-api.js [mock|supabase]');
  process.exit(1);
}

const files = [
  'src/App.tsx',
  'src/components/PlantDetail.tsx',
  'src/components/DataUpload.tsx'
];

const fromApi = mode === 'supabase' ? 'mockApi' : 'supabaseApi';
const toApi = mode === 'supabase' ? 'supabase Api' : 'mockApi';

console.log(`\n🔄 Switching to ${mode.toUpperCase()} API...\n`);

let successCount = 0;
let errorCount = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  ${filePath} - NOT FOUND (skipped)`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Replace import statement
    const fromImport = `from './api/${fromApi}';`;
    const toImport = `from './api/${toApi}';`;
    
    content = content.replace(
      new RegExp(fromImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      toImport
    );
    
    // Also handle double quote imports
    const fromImportDouble = `from "./api/${fromApi}";`;
    const toImportDouble = `from "./api/${toApi}";`;
    
    content = content.replace(
      new RegExp(fromImportDouble.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      toImportDouble
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} - UPDATED`);
      successCount++;
    } else {
      console.log(`ℹ️  ${filePath} - NO CHANGES NEEDED`);
    }
    
  } catch (error) {
    console.log(`❌ ${filePath} - ERROR: ${error.message}`);
    errorCount++;
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Successfully updated: ${successCount} file(s)`);
if (errorCount > 0) {
  console.log(`❌ Errors: ${errorCount} file(s)`);
}
console.log(`\n🎯 Now using: ${mode.toUpperCase()} API`);

if (mode === 'supabase') {
  console.log(`\n⚠️  IMPORTANT: Make sure you have:`);
  console.log(`   1. Created your Supabase project`);
  console.log(`   2. Run supabase-schema.sql in Supabase SQL Editor`);
  console.log(`   3. Created .env file with your credentials`);
  console.log(`   4. Created plant-photos bucket in Storage`);
  console.log(`\n💡 Run: npm run dev (restart if already running)`);
} else {
  console.log(`\n💡 Using local mock data (no backend needed)`);
  console.log(`   Run: npm run dev`);
}

console.log(`${'='.repeat(50)}\n`);
