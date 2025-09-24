import { createContext, useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchTutorialsAndDocuments } from "@/utils/firebase";

// Stores the state of the tutorials
export const TutorialsContext = createContext({ tutorials: [], loading: true });

export const TutorialsProvider = ({ children }) => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-renders the homepage when the tutorials state updates.
  useEffect(() => {
    const queryRef = fetchTutorialsAndDocuments();

    // Listen for updates
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setTutorials(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("tutorials realtime error:", error);
        setTutorials([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <TutorialsContext.Provider value={{ tutorials, loading }}>
      {children}
    </TutorialsContext.Provider>
  );
};
