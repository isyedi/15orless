import { OpenAI } from 'openai';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { ArrowBackIos } from '@mui/icons-material';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have this key in your .env.local
});

export async function POST(req) {
  try {
    const wordsCollection = collection(db, "words");

    const usedWords = [];

    // Fetch all existing words in Firestore
    const allWordsSnapshot = await getDocs(wordsCollection);
    allWordsSnapshot.forEach((doc) => {
      const wordsData = doc.data().words;
      if (Array.isArray(wordsData)) {
        wordsData.forEach((wordObj) => {
          if (wordObj.word) {
            usedWords.push(wordObj.word.toLowerCase());
          }
        });
      }
    });

    console.log("Used words:", usedWords);

    // Decide which prompt to use
    const prompt = usedWords.length === 0 ? generatePrompt() : generatePrompt2(usedWords);

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 300,
    });

    const rawResponse = response.choices[0].message.content;
    console.log("OpenAI raw response:", rawResponse);

    let generatedWordsList;
    try {
      generatedWordsList = JSON.parse(rawResponse);
    } catch (err) {
      console.error("JSON parse error:", err);
      return new Response(JSON.stringify({ success: false, message: "Invalid JSON format from OpenAI" }), { status: 500 });
    }

    if (!generatedWordsList.words || !Array.isArray(generatedWordsList.words)) {
      console.error("Invalid structure:", generatedWordsList);
      return new Response(JSON.stringify({ success: false, message: "Invalid structure: missing 'words' array" }), { status: 500 });
    }

    console.log("Generated words:", generatedWordsList.words);

    await addDoc(wordsCollection, {
      words: generatedWordsList.words,
    });

    return new Response(JSON.stringify({ success: true, message: "List of 8 words added to Firebase successfully!" }), { status: 200 });

  } catch (error) {
    console.error("Error in word generation:", error);
    return new Response(JSON.stringify({ success: false, message: "Error adding words: " + error.message }), { status: 500 });
  }
}


// export async function POST(req) {
//   try {
//     const wordsCollection = collection(db, "words");

//     const usedWords = [];

//     // Fetch all existing words in Firestore
//     const allWordsSnapshot = await getDocs(wordsCollection);
//     allWordsSnapshot.forEach((doc) => {
//       const wordsData = doc.data().words;
//       wordsData.forEach(word => usedWords.push(word.word.toLowerCase()));
//     });

//     console.log(usedWords)

//     //generate new words based on what the used words are if there are any
//     const response = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [{ role: "system", content: !usedWords ? generatePrompt() : generatePrompt2(usedWords)}],
//         max_tokens: 300,
//         });

//     const responseWords = response.choices[0].message.content
//     const generatedWordsList = JSON.parse(responseWords)


//    console.log(generatedWordsList.words)




//    //add words to Firestore collection

//     await addDoc(wordsCollection, {
//         words: generatedWordsList.words,
//     });

//     //console.log("Printed used words!");
//     return new Response(JSON.stringify({ success: true, message: "List of 8 words added to Firebase successfully!" }), { status: 200 });

//   } catch (error) {
//     console.error("Error in word generation:", error);
//     return new Response(JSON.stringify({ success: false, message: "Error adding words: " + error.message }), { status: 500 });
//   }
// }

function generatePrompt() {
  return `Generate 8 words that represent a commonly recognized object, concept, or item (e.g., apple, river, chair) that is simple yet challenging to guess.
  For each word, generate 5 clues that are directly related to the word (e.g., 'fruit' for 'apple', 'water' for 'river'). 
  The clues should be single words that are closely related to the word but not overly obvious.
  Ensure that the words or any of the clues do not contain any commas.
  Format the response as plain JSON with each word having a "word" key and a "clues" key that contains an array of 5 single-word clues. 
  Generate 8 of these words. 
  Do not include any code blocks or backticks.`;
}

function generatePrompt2(usedWords) {
  return `Generate 8 words that represent commonly recognized objects, concepts, or items (e.g., apple, river, chair) that are simple yet challenging to guess.
  For each word, generate 5 clues that are directly related to the word (e.g., 'fruit' for 'apple', 'water' for 'river'). 
  The clues should be single words that are closely related to the word but not overly obvious.
  Ensure that the words or any of the clues do not contain any commas.
  Do not include any of the following words: ${usedWords.join(", ")}.
  Format as JSON like this (no code blocks):

  {
    "words": [
      { "word": "apple", "clues": ["fruit", "red", "tree", "sweet", "juice"] },
      ...
    ]
  }`;
}


