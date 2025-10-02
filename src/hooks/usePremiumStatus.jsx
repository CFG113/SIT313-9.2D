import { useState, useEffect } from "react";
import isUserPremium from "@/utils/firebase";

export default function usePremiumStatus(user) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const result = await isUserPremium();
        setIsPremium(result);
      } catch (error) {
        console.error("isUserPremium failed:", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return { isPremium, loading };
}
