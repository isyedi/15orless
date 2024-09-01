import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET(req) {
  try {
    const wordsCollection = collection(db, "words");
    const snapshot = await getDocs(wordsCollection);

    if (snapshot.empty) {
      console.log("No word lists found in the collection.");
      return new Response(JSON.stringify({ message: "No word lists available." }), { status: 404 });
    }

    const wordLists = [];
    snapshot.forEach((docSnapshot) => {
      wordLists.push(docSnapshot.data().words);
    });

    // Pick a random list from the wordLists array
    const randomList = wordLists[Math.floor(Math.random() * wordLists.length)];

    console.log("Returning random list of 8 words:", randomList);
    return new Response(JSON.stringify({ clues: randomList }), { status: 200 });
  } catch (error) {
    console.error("Error in start-game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
