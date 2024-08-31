import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(req, res) {
  try {
    const wordsCollection = collection(db, "words");
    const snapshot = await getDocs(wordsCollection);

    const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(doc(db, "words", docSnapshot.id)));

    await Promise.all(deletePromises);

    return new Response(JSON.stringify({ message: "All words cleared successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error clearing words:", error);
    return new Response(JSON.stringify({ message: "Error clearing words: " + error.message }), { status: 500 });
  }
}
