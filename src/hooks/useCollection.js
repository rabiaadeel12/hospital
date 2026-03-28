import React from "react";// src/hooks/useCollection.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export function useCollection(collectionName, orderField = "createdAt") {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), orderBy(orderField, "desc"));
      const unsub = onSnapshot(q, (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (err) => {
        setError(err.message);
        setLoading(false);
      });
      return unsub;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, orderField]);

  return { docs, loading, error };
}
