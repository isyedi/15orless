
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(request) {

    try {
      // update user data to backend
      const eventData = await request.json()
      const userRef = doc(db, "userStats", eventData.userId);

        const updatedUserData = {};

        updatedUserData.gamesPlayed = eventData.gamesPlayed;
        updatedUserData.gamesWon = eventData.gamesWon;
        updatedUserData.currentStreak = eventData.currentStreak;
        updatedUserData.lastDatePlayed = eventData.lastDatePlayed;

        await updateDoc(userRef, updatedUserData);
      //}

      return new Response(JSON.stringify({ success: true, message: "Successfully updated user data" }), { status: 200 });

    } catch (error) {
      console.error("Error creating/updating user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to update user data" }), { status: 500 });
    }
}
