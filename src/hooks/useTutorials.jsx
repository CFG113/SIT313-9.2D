import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchUserTutorials } from "@/utils/firebase";

export default function useTutorials(uid) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for real time updates for when a user adds a tutorial to render it in their tutorial page
  useEffect(() => {
    // Prevent If user logs off on the tutorials page
    if (!uid) {
      setTutorials([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const queryRef = fetchUserTutorials(uid);

    const unsubscribe = onSnapshot(
      queryRef,
      (snap) => {
        setTutorials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("tutorials query error:", error);
        setTutorials([]);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // remove the listener when the user changes
  }, [uid]);

  return { tutorials, loading };
}
