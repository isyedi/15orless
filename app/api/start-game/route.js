// app/api/start-game/route.js

import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET(req) {
  try {
    const wordsCollection = collection(db, "words");

    // Fetch all documents first
    const allWordsSnapshot = await getDocs(wordsCollection);
    const allWords = [];
    
    allWordsSnapshot.forEach((docSnapshot) => {
      const wordData = docSnapshot.data();
      allWords.push(wordData);
    });

    if (allWords.length === 0) {
      console.log("No words found in the collection.");
      return new Response(JSON.stringify({ message: "No more words available." }), { status: 404 });
    }

    // Shuffle the array and select the first 8 words
    const shuffledWords = allWords.sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, 8);

    console.log("Returning random words with clues:", selectedWords);
    return new Response(JSON.stringify({ clues: selectedWords }), { status: 200 });
  } catch (error) {
    console.error("Error in start-game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }  
}
