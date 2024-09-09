
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { PanoramaFishEye } from "@mui/icons-material";

export async function GET(req) {
    try {
      // Reference to the user's document in the "userStats" collection, where userId is the key
      console.log(req.query())
      const userRef = doc(db, "userStats", params);
      const docSnap = await getDoc(userRef);

      const userData = []
      docSnap.forEach((x) => {
        userData.push(x.data())
      });


      return new Response(JSON.stringify({ data: "Successfully retrieved user data: " + userData}), { status: 200 });

    } catch (error) {
      console.error("Error retrieving user data: ", error);
      return new Response(JSON.stringify({ success: false, message: "Failed to retrieve user data" }), { status: 500 });
    }
}