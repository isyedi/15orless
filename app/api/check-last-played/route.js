import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";


export async function POST(req) {
  try {
    const { userId } = await req.json();  // Ensure you're passing the userId from the client

    const todaysLocalDate = new Date().toLocaleDateString('en-CA');  // Get local date for user
    const lastPlayedDoc = doc(db, "userStats", userId);

    const lastPlayedSnapshot = await getDoc(lastPlayedDoc);
    const lastPlayedData = lastPlayedSnapshot.data();

    if (!lastPlayedSnapshot.exists()) {
      return new Response(JSON.stringify({ playable: true, message: "No game data found. You can play today!" }), { status: 200 });
    }

    // If user has already played today, return that information
    if (lastPlayedData?.lastDatePlayed === todaysLocalDate) {
      return new Response(JSON.stringify({ playable: false, message: "You have already played today!" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ playable: true, message: "You can play today!" }), { status: 200 });
    }
  } catch (error) {
    console.error("Error checking user play status:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}