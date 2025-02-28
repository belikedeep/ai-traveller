"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
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
    router.push("/");
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      {/* Header */}
      {/* <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">TripAI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900"
            >
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="outline" className="mr-2">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header> */}
      <Image
        src="/logo.svg"
        alt="Logo"
        width={40}
        height={40}
        className="cursor-pointer"
        onClick={() => {
          if (user) {
            router.push("/my-trips");
          } else {
            router.push("/");
          }
        }}
      />
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button onClick={() => router.push("/pricing")} variant="outline">
              {user.credits ?? 0} Credits
            </Button>
            <Button onClick={() => router.push("/create-trip")}>
              Create Trip
            </Button>
            <Button onClick={() => router.push("/my-trips")}>My Trips</Button>
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
