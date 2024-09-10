
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(request) {

    try {
      // create a userData entry in the backend if it doesn't already exist
      const eventData = await request.json()
      console.log(eventData.user)
      const userRef = doc(db, "userStats", eventData.user);
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
        console.log('user data already exists')
      }

      return new Response(JSON.stringify({ success: true, message: "Successfully created user data" }), { status: 200 });

    } catch (error) {
      console.error("Error creating user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to create user data" }), { status: 500 });
    }
}
