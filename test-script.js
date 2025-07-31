// Node.js test script to verify the UMD bundle
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('🧪 Testing StickerVerse Editor Integration...\n');

// Test 1: Check if files exist
console.log('📁 File Existence Test:');
const filesToCheck = [
  'dist/simple-sticker-editor.umd.js',
  'dist/stickerverse_sticker_editor.css',
  'sample-website.html',
  'test-integration.html'
];

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file} ${exists ? 'exists' : 'missing'}`);
});

// Test 2: Check UMD bundle content
console.log('\n📦 UMD Bundle Analysis:');
const bundlePath = 'dist/simple-sticker-editor.umd.js';
if (fs.existsSync(bundlePath)) {
  const bundleContent = fs.readFileSync(bundlePath, 'utf8');
  
  console.log(`  📊 Bundle size: ${(bundleContent.length / 1024).toFixed(2)} KB`);
  
  // Check for key patterns
  const patterns = [
    { name: 'UMD wrapper', pattern: /typeof exports=="object"&&typeof module/, found: false },
    { name: 'SimpleStickerEditor export', pattern: /SimpleStickerEditor/, found: false },
    { name: 'React integration', pattern: /React/, found: false },
    { name: 'ReactDOM integration', pattern: /ReactDOM/, found: false }
  ];
  
  patterns.forEach(check => {
    check.found = check.pattern.test(bundleContent);
    console.log(`  ${check.found ? '✅' : '❌'} ${check.name}`);
  });
}

// Test 3: HTML file analysis
console.log('\n📄 HTML Files Analysis:');
['sample-website.html', 'test-integration.html'].forEach(htmlFile => {
  if (fs.existsSync(htmlFile)) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const checks = [
      { name: 'React CDN', pattern: /react@18\/umd\/react/, found: false },
      { name: 'ReactDOM CDN', pattern: /react-dom@18\/umd\/react-dom/, found: false },
      { name: 'UMD Bundle Reference', pattern: /simple-sticker-editor\.umd\.js/, found: false },
      { name: 'SimpleStickerEditor.init', pattern: /SimpleStickerEditor\.init/, found: false },
      { name: 'Editor Container', pattern: /id="sticker-editor"/, found: false }
    ];
    
    console.log(`\n  📋 ${htmlFile}:`);
    checks.forEach(check => {
      check.found = check.pattern.test(content);
      console.log(`    ${check.found ? '✅' : '❌'} ${check.name}`);
    });
  }
});

// Test 4: Server connectivity test
console.log('\n🌐 Server Test:');

const testUrl = (url, callback) => {
  const request = http.get(url, (res) => {
    console.log(`  ✅ ${url} - Status: ${res.statusCode}`);
    callback();
  });
  
  request.on('error', (err) => {
    console.log(`  ❌ ${url} - Error: ${err.message}`);
    callback();
  });
  
  request.setTimeout(5000, () => {
    console.log(`  ⏰ ${url} - Timeout`);
    request.destroy();
    callback();
  });
};

const urlsToTest = [
  'http://localhost:3000/',
  'http://localhost:3000/sample-website.html',
  'http://localhost:3000/test-integration.html',
  'http://localhost:3000/dist/simple-sticker-editor.umd.js'
];

let testsRemaining = urlsToTest.length;
urlsToTest.forEach(url => {
  testUrl(url, () => {
    testsRemaining--;
    if (testsRemaining === 0) {
      console.log('\n🎉 Testing Complete!');
      console.log('\n📖 How to test in browser:');
      console.log('  1. Open: http://localhost:3000/sample-website.html');
      console.log('  2. Open: http://localhost:3000/test-integration.html');
      console.log('  3. Open browser developer tools (F12)');
      console.log('  4. Check console for initialization messages');
      console.log('  5. Look for the editor UI in the designated container');
    }
  });
});