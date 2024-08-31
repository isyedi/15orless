// app/api/word-count/route.js

import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET(req) {
  try {
    const wordsCollection = collection(db, "words");
    const snapshot = await getCountFromServer(wordsCollection);
    
    return new Response(JSON.stringify({ count: snapshot.data().count }), { status: 200 });
  } catch (error) {
    console.error("Error fetching word count:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
