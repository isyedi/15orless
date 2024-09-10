
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET(request, res) {
    try {
      // Retrieve user data to update the frontend stats
      const userId = request.nextUrl.searchParams.get("user");
      const docRef = doc(db, 'userStats', userId)
      const snapshot = await getDoc(docRef)
      const userData = []
      if (snapshot.exists()) {
        console.log(snapshot.data())
        userData.push(snapshot.data())
      }
      else{
        console.log('user data does not exist!')
      }

      return new Response(JSON.stringify({ data: userData }), { status: 200 });

    } catch (error) {
      console.error("Error retrieving user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to retrieve user data" }), { status: 500 });
    }
}