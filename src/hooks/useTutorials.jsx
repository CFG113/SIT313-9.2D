import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchUserTutorials } from "@/utils/firebase";

export default function useTutorials(uid) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const queryRef = fetchUserTutorials(uid);

    const unsubscribe = onSnapshot(
      queryRef,
      (snap) => {
        setTutorials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("tutorials query error:", err);
        setTutorials([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { tutorials, loading };
}
