import { OpenAI } from 'openai';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have this key in your .env.local
});

export async function POST(req) {
  try {
    const wordsCollection = collection(db, "words");

    let wordAdded = false;

    while (!wordAdded) {
      // Generate the word with OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: generatePrompt() }],
        max_tokens: 300,
      });

      const generatedWord = parseOpenAIResponse(response.choices)[0];
      const normalizedWord = generatedWord.word.toLowerCase();

      // Check if the word already exists
      const existingWordQuery = query(wordsCollection, where("word", "==", normalizedWord));
      const existingWordSnapshot = await getDocs(existingWordQuery);

      if (existingWordSnapshot.empty) {
        // Add the word to Firestore
        await addDoc(wordsCollection, {
          word: normalizedWord,
          clues: generatedWord.clues,
        });

        console.log(`Word "${normalizedWord}" added to Firestore successfully!`);
        wordAdded = true; // Exit the loop once a new word is added
        return new Response(JSON.stringify({ success: true, word: normalizedWord, message: "Word added to Firebase successfully!" }), { status: 200 });
      } else {
        console.log(`Word "${normalizedWord}" already exists. Generating a new word...`);
      }
    }

  } catch (error) {
    console.error("Error in word generation:", error);
    return new Response(JSON.stringify({ success: false, message: "Error adding words: " + error.message }), { status: 500 });
  }
}

function generatePrompt() {
  return `Generate a word or phrase that represents a category, topic, sports team, object, location (country, city, etc.), famous person (must have first and last name), or a commonly recognized thing, especially in pop culture.
  Ensure that the word or phrase does not contain any commas. Avoid generating too many famous names; ensure a diverse mix of categories.
  For this word or phrase, generate 15 progressively obvious one-word clues.
  The clues should be a single word each, ranging from slightly subtle to very obvious.
  Format the response as plain JSON with the word having a "word" key and a "clues" key 
  that contains an array of 15 single-word clues. Ensure the clues are directly related to the word and avoid any multi-word clues for the clues.
  Do not include any code blocks or backticks.`;
}

function parseOpenAIResponse(choices) {
  return choices.map((choice) => {
    const cleanedContent = choice.message.content.trim().replace(/```json|```/g, '');

    try {
      const data = JSON.parse(cleanedContent);
      if (data && data.word && data.clues) {
        return {
          word: data.word,
          clues: data.clues,
        };
      } else {
        console.warn("Incomplete data received, retrying...");
        return null;
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return null;
    }
  }).filter(word => word !== null);
}
