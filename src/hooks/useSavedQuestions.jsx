import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchSavedQuestions } from "@/utils/firebase";

export default function useSavedQuestions(uid) {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setSavedQuestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const queryRef = fetchSavedQuestions(uid);

    const unsubscribe = onSnapshot(
      queryRef,
      (snap) => {
        setSavedQuestions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("saved questions query error:", error);
        setSavedQuestions([]);
        setLoading(false);
      }
    );

    // cleanup on uid change/unmount
    return () => unsubscribe();
  }, [uid]);

  return { savedQuestions, loading };
}
