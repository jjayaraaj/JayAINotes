// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "jayai-notes.firebaseapp.com",
  projectId: "jayai-notes",
  storageBucket: "jayai-notes.appspot.com",
  messagingSenderId: "499728187640",
  appId: "1:499728187640:web:5e3197e325985451aa3b0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export async function uploadFileToFirebase(imageUrl:string, name: string) {
    try{
        const response = await fetch(imageUrl);
        const bufer = response.arrayBuffer()
        const file_name = name.replace(" ", "") + Date.now + ".jpeg";
        const storageRef = ref(storage, file_name);
    }
    catch(error) {

    }
    
}