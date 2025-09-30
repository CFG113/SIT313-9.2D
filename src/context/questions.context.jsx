import { createContext, useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { fetchQuestions } from "@/utils/firebase";

// Stores the state of the questions
export const QuestionsContext = createContext({ questions: [], loading: true });

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-renders whenever the questions state updates.
  useEffect(() => {
    const queryRef = fetchQuestions();

    // Listen for updates
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setQuestions(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              titleLower: data.title.toLowerCase(),
            };
          })
        );
        setLoading(false);
      },
      (error) => {
        console.error("questions realtime error:", error);
        setQuestions([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <QuestionsContext.Provider value={{ questions, loading }}>
      {children}
    </QuestionsContext.Provider>
  );
};
