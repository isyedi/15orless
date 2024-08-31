// app/api/word-count/route.js

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET(req) {
  try {
    const wordsCollection = collection(db, "words");
    const snapshot = await getDocs(wordsCollection);
    const count = snapshot.size;

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    console.error("Error fetching word count:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
