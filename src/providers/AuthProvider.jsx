"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { setAuthUser, clearAuthUser } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ... user sync logic ...
        Cookies.set("session", user.uid, { expires: 7 }); 
        
        let profileData = {};
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            profileData = docSnap.data();
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }

        dispatch(
          setAuthUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || profileData.displayName,
            role: profileData.role || "student",
            ...profileData
          })
        );

        // Path protection: Redirect if user is on a dashboard they don't belong to
        const role = profileData.role || "student";
        if (pathname.startsWith("/dashboard/")) {
          const pathSegments = pathname.split("/");
          const currentDashboardRole = pathSegments[2]; // /dashboard/[role]/...
          if (currentDashboardRole && role !== currentDashboardRole) {
            router.replace(`/dashboard/${role}`);
          }
        }
      } else {
        // Just clear the session; the proxy or user actions will handle redirects
        Cookies.remove("session");
        dispatch(clearAuthUser());

        // Redirect unauthenticated users away from protected routes
        if (pathname.startsWith("/dashboard")) {
          window.location.href = "/login";
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
