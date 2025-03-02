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
import Link from "next/link";
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
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center px-6">
        <Link
          href={user ? "/my-trips" : "/"}
          className="flex items-center group"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer transition-transform duration-200 group-hover:scale-110"
          />
          <span className="ml-3 text-foreground font-bold text-lg">TripAI</span>
        </Link>
        <nav className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleNavigation("/pricing")}
                variant="outline"
                className="text-foreground hover:bg-accent transition-colors duration-200"
              >
                💰 {user.credits ?? 0} Credits
              </Button>
              <Button
                onClick={() => handleNavigation("/create-trip")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:shadow-indigo-600/40"
              >
                ✨ Create Trip
              </Button>
              <Button
                onClick={() => handleNavigation("/my-trips")}
                variant="ghost"
                className="text-foreground hover:bg-accent transition-colors duration-200"
              >
                My Trips
              </Button>
              <Popover>
                <PopoverTrigger>
                  <div className="relative group">
                    <Image
                      src={user.picture}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer border-2 border-border/40 transition-all duration-200 group-hover:border-indigo-600 group-hover:scale-105"
                      alt={user.name}
                    />
                    <div className="absolute inset-0 rounded-full bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-background/95 backdrop-blur-sm border-border/40 shadow-xl">
                  <div className="p-3">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full mt-3 hover:bg-accent text-foreground transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:shadow-indigo-600/40"
            >
              🚀 Sign Up
            </Button>
          )}
        </nav>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-sm border-border/40 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Sign in with Google
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <p>
                Sign in to TripAI with Google for a seamless travel planning
                experience.
              </p>
              <Button
                onClick={() => login()}
                className="w-full mt-5 flex gap-4 items-center bg-background hover:bg-accent text-foreground transition-colors duration-200"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}
