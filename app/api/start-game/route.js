import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET() {
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

    // Get the current time local to user
    const todaysLocalDate = new Date().toLocaleDateString('en-CA');  // Format as YYYY-MM-DD

    // Check if a word set for today exists in the 'dailygame' collection
    const dailyWordsetDoc = doc(db, "dailyWordsets", todaysLocalDate);
    const dailyWordsetSnapshot = await getDoc(dailyWordsetDoc);

    let wordset;

    if (dailyWordsetSnapshot.exists()) {
      // Word set for today exists, return it
      wordset = dailyWordsetSnapshot.data().words;
    } else {
      // No word set for today, select a random word set and save it for today
      wordset = wordLists[Math.floor(Math.random() * wordLists.length)];
      await setDoc(dailyWordsetDoc, { words: wordset });
    }

    console.log("Returning daily word set for 12:00 AM EST:", wordset);
    return new Response(JSON.stringify({ clues: wordset }), { status: 200 });
  } catch (error) {
    console.error("Error in start-game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
