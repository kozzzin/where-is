import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCCoISQ5ivSL90e133I8OtPrXJjue67I_w",
  authDomain: "waldo-6fab0.firebaseapp.com",
  projectId: "waldo-6fab0",
  storageBucket: "waldo-6fab0.appspot.com",
  messagingSenderId: "273384284677",
  appId: "1:273384284677:web:bb3763eb59da534e67326c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getCoordsFromBase(level, character) {
  const docRef = await getDoc(doc(db, "Coordinates", level));
  const content = docRef.data();
  return Object.values(content).find(el => el.name === character);
}

export async function getLeadersForLevel(level) {
  const docRef = await getDoc(doc(db, "BestTimes", level));
  const content = docRef.data();
  return content;
}

export async function saveNewLevelLeaders(level, leaderboard) {
  try {
    await setDoc(doc(db, "BestTimes", level), {
      times: [...leaderboard]
    });
  } catch (e) {
            console.error("Error adding document: ", e);
  }
}

// getCoordsFromBase('hollywood','waldo')
//   .then(console.log);

// Object.keys(coordinates).forEach(
//   async (key) => {

//     try {
//       // const docRef = await addDoc(collection(db, "Coordinates", key), {
//       //   level: key,
//       //   data: coordinates[key]
//       // });
//       await setDoc(doc(db, "Coordinates", key), {
//         // level: key,
//         ...coordinates[key]
//       });
//       // console.log("Document written with ID: ", docRef.id);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }

//     console.log(key);
    
//   }
// )

