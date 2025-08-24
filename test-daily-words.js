// Test script for daily word generation system
// Run this with: node test-daily-words.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this to your deployed URL

async function testDailyWordGeneration() {
  console.log('🧪 Testing Daily Word Generation System\n');

  try {
    // Test 1: Manual generation of today's words
    console.log('1️⃣ Testing manual daily word generation...');
    const response = await axios.post(`${BASE_URL}/api/generate-todays-words`);
    
    if (response.data.success) {
      console.log('✅ Success! Generated words for:', response.data.date);
      console.log('📊 Word count:', response.data.wordCount);
      console.log('🔤 Sample word:', response.data.words[0]?.word);
    } else {
      console.log('❌ Failed to generate words');
    }

    // Test 2: Check if words are accessible via start-game
    console.log('\n2️⃣ Testing word retrieval via start-game...');
    const gameResponse = await axios.get(`${BASE_URL}/api/start-game`);
    
    if (gameResponse.data.clues) {
      console.log('✅ Success! Retrieved words from start-game');
      console.log('📊 Retrieved word count:', gameResponse.data.clues.length);
    } else {
      console.log('❌ Failed to retrieve words from start-game');
    }

    // Test 3: Check admin page accessibility
    console.log('\n3️⃣ Testing admin page accessibility...');
    try {
      const adminResponse = await axios.get(`${BASE_URL}/admin`);
      console.log('✅ Admin page is accessible');
    } catch (error) {
      console.log('⚠️  Admin page may require authentication:', error.message);
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy to Vercel with: vercel --prod');
    console.log('2. Verify cron job is scheduled in Vercel dashboard');
    console.log('3. Wait for midnight PST or test manually via admin page');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testDailyWordGeneration();

