// app/api/populate-words/route.js

import { OpenAI } from 'openai';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you have this key in your .env.local
});

export async function POST(req) {
  console.log("Starting word generation...");

  const wordsCollection = collection(db, "words");

  try {
    console.log("Calling OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: generatePrompt() }],
      max_tokens: 300,
    });

    console.log("OpenAI response received:", JSON.stringify(response.choices, null, 2));

    const generatedWords = parseOpenAIResponse(response.choices);

    for (let word of generatedWords) {
      let normalizedWord = word.word.toLowerCase();
      
      let existingWordQuery = query(wordsCollection, where("word", "==", normalizedWord));
      let existingWordSnapshot = await getDocs(existingWordQuery);

      while (!existingWordSnapshot.empty) {
        console.log(`Word "${normalizedWord}" already exists in Firestore, generating a new word...`);
        

        const newResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: generatePrompt() }],
          max_tokens: 300,
        });

        const newGeneratedWords = parseOpenAIResponse(newResponse.choices);
        word = newGeneratedWords[0];
        normalizedWord = word.word.toLowerCase();

        existingWordQuery = query(wordsCollection, where("word", "==", normalizedWord));
        existingWordSnapshot = await getDocs(existingWordQuery);
      }

      console.log("Adding word to Firestore:", normalizedWord);
      await addDoc(wordsCollection, {
        word: normalizedWord,
        clues: word.clues,
      });
    }

    console.log("Words added successfully!");
    return new Response(JSON.stringify({ message: "Words added to Firebase successfully!" }), { status: 200 });

  } catch (error) {
    console.error("Error in word generation:", error);
    return new Response(JSON.stringify({ message: "Error adding words: " + error.message }), { status: 500 });
  }
}

// Generate a prompt to send to OpenAI
function generatePrompt() {
  return `Generate a word that represents a category, topic, object, famous person, or a commonly recognized thing.
  Avoid using overly common words like 'elephant', 'apple', 'car', etc. For this word, generate 15 progressively obvious one-word clues.
  The clues should be a single word each, ranging from very subtle to very obvious.
  Format the response as plain JSON with the word having a "word" key and a "clues" key 
  that contains an array of 15 single-word clues. Ensure the clues are directly related to the word and avoid any multi-word clues.
  Do not include any code blocks or backticks.`;
}

// Parse the response from OpenAI into a usable format
function parseOpenAIResponse(choices) {
  return choices.map((choice) => {
    // Clean the content by removing any backticks or extraneous characters
    const cleanedContent = choice.message.content.trim().replace(/```json|```/g, '');
    
    try {
      const data = JSON.parse(cleanedContent);
      if (data && data.word && data.clues) {
        console.log("Parsed data:", data);
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
      return null;  // Handle this appropriately in your application
    }
  }).filter(word => word !== null); // Filter out any null results
}
