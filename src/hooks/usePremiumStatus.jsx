import { useState, useEffect } from "react";
import isUserPremium from "@/utils/firebase";

export default function usePremiumStatus(user) {
  const [premiumStatus, setPremiumStatus] = useState(false);

  useEffect(() => {
    if (!user) {
      setPremiumStatus(false);
      return;
    }

    const checkPremiumStatus = async function () {
      // isUserPremium reads custom claims via firebase auth
      setPremiumStatus(await isUserPremium());
    };

    checkPremiumStatus();
  }, [user]);

  return premiumStatus;
}
