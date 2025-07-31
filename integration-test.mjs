#!/usr/bin/env node

console.log('🧪 StickerVerse Editor Integration Test\n');

// Test 1: Check files exist
console.log('📁 File Existence Test:');
import fs from 'fs';
const requiredFiles = [
  'dist/simple-sticker-editor.umd.js',
  'dist/stickerverse_sticker_editor.css',
  'test-integration.html',
  'browser-test.html'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please run "npm run build" first.');
  process.exit(1);
}

// Test 2: Analyze UMD bundle
console.log('\n📦 UMD Bundle Analysis:');
const bundleContent = fs.readFileSync('dist/simple-sticker-editor.umd.js', 'utf8');
console.log(`  📊 Bundle size: ${(bundleContent.length / 1024).toFixed(2)} KB`);

const patterns = [
  { name: 'UMD wrapper', pattern: /typeof exports=="object"&&typeof module/ },
  { name: 'SimpleStickerEditor export', pattern: /SimpleStickerEditor=\{/ },
  { name: 'init function', pattern: /init:/ },
  { name: 'React integration', pattern: /React\./ }
];

patterns.forEach(check => {
  const found = check.pattern.test(bundleContent);
  console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
});

// Test 3: CSS Analysis
console.log('\n🎨 CSS Analysis:');
const cssContent = fs.readFileSync('dist/stickerverse_sticker_editor.css', 'utf8');
console.log(`  📊 CSS size: ${(cssContent.length / 1024).toFixed(2)} KB`);

const cssChecks = [
  { name: 'Tailwind CSS', pattern: /@layer/ },
  { name: 'Custom properties', pattern: /--tw-/ },
  { name: 'Component styles', pattern: /\.custom-scrollbar/ }
];

cssChecks.forEach(check => {
  const found = check.pattern.test(cssContent);
  console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
});

// Test 4: HTML Files Analysis
console.log('\n📄 HTML Files Analysis:');
['test-integration.html', 'browser-test.html'].forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const checks = [
    { name: 'CSS link', pattern: /stickerverse_sticker_editor\.css/ },
    { name: 'React CDN', pattern: /react@18\/umd/ },
    { name: 'UMD script', pattern: /simple-sticker-editor\.umd\.js/ },
    { name: 'Editor container', pattern: /id="sticker-editor"/ },
    { name: 'Initialization script', pattern: /SimpleStickerEditor\.init/ }
  ];
  
  console.log(`\n  📋 ${htmlFile}:`);
  checks.forEach(check => {
    const found = check.pattern.test(content);
    console.log(`    ${found ? '✅' : '❌'} ${check.name}`);
  });
});

console.log('\n🎉 Integration test complete!');
console.log('\n📖 Next steps:');
console.log('  1. Open test-integration.html in a web browser');
console.log('  2. Open browser developer tools (F12)');
console.log('  3. Check console for initialization messages');
console.log('  4. Look for editor UI in the container');
console.log('  5. Test functionality with the provided buttons');