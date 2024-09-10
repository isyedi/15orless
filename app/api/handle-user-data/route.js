
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(request) {

    try {
      // Reference to the user's document in the "userStats" collection, where userId is the key
      const eventData = await request.json()
      const userRef = doc(db, "userStats", eventData.userId);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {

        const initialData = {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          lastDatePlayed: "", 
        };

        await setDoc(userRef, initialData);
        console.log("User data created successfully!");
      }
      else {

        const updatedUserData = {};

        updatedUserData.gamesPlayed = eventData.gamesPlayed;
        updatedUserData.gamesWon = eventData.gamesWon;
        updatedUserData.currentStreak = eventData.currentStreak;
        updatedUserData.lastDatePlayed = eventData.lastDatePlayed;
        console.log(updatedUserData)

        await updateDoc(userRef, updatedUserData);
      }

      return new Response(JSON.stringify({ success: true, message: "Successfully updated user data" }), { status: 200 });

    } catch (error) {
      console.error("Error creating/updating user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to update user data" }), { status: 500 });
    }
}
