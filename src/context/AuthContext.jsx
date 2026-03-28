import React from "react";
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // "admin" | "patient" | null
  const [loading, setLoading] = useState(true);

  // Register new patient
  async function registerPatient(email, password, displayName, phone) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      displayName,
      email,
      phone,
      role: "patient",
      createdAt: serverTimestamp(),
    });
    return cred;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Fetch role from Firestore on auth change
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        setUserRole(docSnap.exists() ? docSnap.data().role : null);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = { currentUser, userRole, login, logout, registerPatient, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
