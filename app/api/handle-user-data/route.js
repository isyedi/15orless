
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(req) {

    try {
      // Reference to the user's document in the "userStats" collection, where userId is the key
      const { eventData } = await req.json();
      console.log(eventData.userId)

      const userRef = doc(db, "userStats", eventData.userId);

      // Check if the document already exists
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // If the document doesn't exist, create new data with default values
        const initialData = {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          lastDatePlayed: "", // Initialize as an empty string
        };

        // Create a new document for the user with initial data
        await setDoc(userRef, initialData);
        console.log("User data created successfully!");
      }

      // Now proceed to update the document with the provided eventData
      const updatedUserData = {};

      updatedUserData.gamesPlayed = eventData.gamesPlayed;
      updatedUserData.gamesWon = eventData.gamesWon;
      updatedUserData.currentStreak = eventData.currentStreak;
      updatedUserData.lastDatePlayed = eventData.lastDatePlayed;

      // if (eventData?.gamesPlayed !== null) {
      //   updatedUserData.gamesPlayed = eventData.gamesPlayed;
      // }
      // if (eventData?.gamesWon !== null) {
      //   updatedUserData.gamesWon = eventData.gamesWon;
      // }
      // if (eventData?.currentStreak !== null) {
      //   updatedUserData.currentStreak = eventData.currentStreak;
      // }
      // if (eventData?.lastDatePlayed !== null) {
      //   updatedUserData.lastDatePlayed = eventData.lastDatePlayed;
      // }

      // Update the user's document with new data
      await updateDoc(userRef, updatedUserData);
      return new Response(JSON.stringify({ success: true, message: "Successfully updated user data" }), { status: 200 });

    } catch (error) {
      console.error("Error creating/updating user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to update user data" }), { status: 500 });
    }
}
