"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const UserSync = () => {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const handleUserSync = async () => {
      try {
        await syncUser();
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    };

    handleUserSync(); // ✅ THIS WAS MISSING
  }, [isLoaded, isSignedIn]);

  return null;
};

export default UserSync;
