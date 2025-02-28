import { db } from "./FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export interface User {
  name: string;
  email: string;
  picture: string;
  credits: number;
}

export const initializeUser = async (userData: Omit<User, "credits">) => {
  const userRef = doc(db, "users", userData.email);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user with initial credits
    await setDoc(userRef, {
      ...userData,
      credits: 0,
    });
  }

  return await getUser(userData.email);
};

export const getUser = async (email: string) => {
  const userRef = doc(db, "users", email);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as User;
};

export const updateUserCredits = async (email: string, credits: number) => {
  const userRef = doc(db, "users", email);
  await updateDoc(userRef, {
    credits,
  });
  return await getUser(email);
};

export const CREDIT_COSTS = {
  TRIP_CREATION: 1,
};
