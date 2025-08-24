import { OpenAI } from 'openai';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    // Get today's date in PST (UTC-8)
    const today = new Date();
    const pstOffset = -8 * 60; // PST is UTC-8
    const pstDate = new Date(today.getTime() + (pstOffset * 60 * 1000));
    const todaysDate = pstDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
    
    console.log(`Cron job: Generating new words for date: ${todaysDate}`);

    // Check if words for today already exist
    const dailyWordsetDoc = doc(db, "dailyWordsets", todaysDate);
    
    // Pre-load ALL existing words from dailyWordsets to avoid duplicates
    console.log('Loading existing words to avoid duplicates...');
    const dailyWordsetsCollection = collection(db, "dailyWordsets");
    const allDailyWordsetsSnapshot = await getDocs(dailyWordsetsCollection);
    
    const existingWords = new Set();
    allDailyWordsetsSnapshot.forEach((docSnapshot) => {
      const wordsData = docSnapshot.data().words;
      wordsData.forEach(word => existingWords.add(word.word.toLowerCase()));
    });
    
    console.log(`Found ${existingWords.size} existing words to avoid`);

    // Generate all 8 words in a single batch with a comprehensive prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ 
        role: "system", 
        content: generateBatchPrompt(Array.from(existingWords))
      }],
      max_tokens: 1000, // Increased for batch generation
    });

    const generatedWords = parseBatchResponse(response.choices[0].message.content);
    
    if (!generatedWords || generatedWords.length !== 8) {
      throw new Error(`Expected 8 words, but got ${generatedWords?.length || 0}`);
    }

    // Save the daily wordset for today
    await setDoc(dailyWordsetDoc, {
      words: generatedWords,
      date: todaysDate,
      generatedAt: new Date().toISOString()
    });

    console.log(`Cron job: Daily wordset for ${todaysDate} generated and saved successfully!`);
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Daily wordset for ${todaysDate} generated successfully!`,
      date: todaysDate,
      wordCount: generatedWords.length
    }), { status: 200 });

  } catch (error) {
    console.error("Error in cron word generation:", error);
    return new Response(JSON.stringify({ success: false, message: "Error generating daily words: " + error.message }), { status: 500 });
  }
}

function generateBatchPrompt(existingWords) {
  const existingWordsList = existingWords.length > 0 ? existingWords.join(', ') : 'none';
  
  return `Generate exactly 8 unique words for a word guessing game. Each word should represent a commonly recognized object, concept, or item (e.g., apple, river, chair) that is simple yet challenging to guess.

IMPORTANT: Do NOT use any of these existing words: ${existingWordsList}

For each word, generate 5 clues that are directly related to the word (e.g., 'fruit' for 'apple', 'water' for 'river'). The clues should be single words that are closely related to the word but not overly obvious.

Format the response as a JSON array with exactly 8 objects, each having a "word" key and a "clues" key that contains an array of 5 single-word clues.

Example format:
[
  {"word": "example1", "clues": ["clue1", "clue2", "clue3", "clue4", "clue5"]},
  {"word": "example2", "clues": ["clue1", "clue2", "clue3", "clue4", "clue5"]}
  ... (6 more word objects)
]

Ensure that:
1. All 8 words are unique and different from each other
2. None of the words match the existing words: ${existingWordsList}
3. Each word has exactly 5 clues
4. No commas within words or clues
5. Response is valid JSON`;
}

function parseBatchResponse(content) {
  try {
    const cleanedContent = content.trim().replace(/```json|```/g, '');
    const data = JSON.parse(cleanedContent);
    
    if (Array.isArray(data) && data.length === 8) {
      return data.map(item => {
        if (item && item.word && Array.isArray(item.clues) && item.clues.length === 5) {
          return {
            word: item.word.toLowerCase(),
            clues: item.clues
          };
        }
        return null;
      }).filter(word => word !== null);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error("Error parsing batch response:", error);
    throw new Error('Failed to parse OpenAI response');
  }
}

