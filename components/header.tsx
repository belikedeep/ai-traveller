"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";
import { initializeUser, getUser } from "@/service/UserService";
import type { User } from "@/service/UserService";

interface UserProfile extends Omit<User, "credits"> {
  credits?: number;
}

interface TokenInfo {
  access_token: string;
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const checkUserAndCredits = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Get latest credits from Firestore
        const firestoreUser = await getUser(parsedUser.email);
        if (firestoreUser) {
          const updatedUser = { ...parsedUser, credits: firestoreUser.credits };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        } else {
          setUser(parsedUser);
        }
      }
    };

    checkUserAndCredits();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response as TokenInfo),
    onError: (error) => console.error("Login Failed:", error),
    scope: "email profile",
  });

  const GetUserProfile = async (tokenInfo: TokenInfo) => {
    try {
      const response = await axios.get<UserProfile>(
        `https://www.googleapis.com/oauth2/v1/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );

      const googleUser = response.data;
      const firestoreUser = await initializeUser(googleUser);

      if (!firestoreUser) {
        throw new Error("Failed to initialize user");
      }

      const userWithCredits = {
        ...googleUser,
        credits: firestoreUser.credits,
      };

      localStorage.setItem("user", JSON.stringify(userWithCredits));
      setUser(userWithCredits);
      setOpenDialog(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={40}
        height={40}
        className="cursor-pointer"
        onClick={() => handleNavigation(user ? "/my-trips" : "/")}
      />
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button
              onClick={() => handleNavigation("/pricing")}
              variant="outline"
            >
              {user.credits ?? 0} Credits
            </Button>
            <Button onClick={() => handleNavigation("/create-trip")}>
              Create Trip
            </Button>
            <Button onClick={() => handleNavigation("/my-trips")}>
              My Trips
            </Button>
            <Popover>
              <PopoverTrigger>
                <Image
                  src={user.picture}
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer"
                  alt={user.name}
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign Up</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Google</DialogTitle>
            <DialogDescription>
              <p>Sign in to the App with Google authentication securely</p>

              <Button
                onClick={() => login()}
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
