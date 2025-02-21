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

interface UserProfile {
  name: string;
  email: string;
  picture: string;
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

  const GetUserProfile = (tokenInfo: TokenInfo) => {
    axios
      .get<UserProfile>(`https://www.googleapis.com/oauth2/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setOpenDialog(false);
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={120}
        height={40}
        className="cursor-pointer"
        onClick={() => router.push("/")}
      />
      <div className="flex items-center gap-4">
        {user ? (
          <>
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
            <img src="/logo.svg" alt="Logo" />
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
