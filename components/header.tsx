"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomDialog from "@/components/ui/CustomDialog";
import { FcGoogle } from "react-icons/fc";
import { Menu, X } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeUser, getUser } from "@/service/UserService";
import {
  syncUserAuth,
  setUserCookie,
  setUserStorage,
  clearUserAuth,
  type User,
} from "@/lib/auth-utils";

interface TokenInfo {
  access_token: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const checkUserAndCredits = async () => {
    const userData = syncUserAuth();
    if (userData) {
      // Get latest credits from Firestore
      const firestoreUser = await getUser(userData.email);
      if (firestoreUser) {
        const updatedUser = {
          ...userData,
          credits: firestoreUser.credits,
          plan: firestoreUser.plan,
        };
        setUserStorage(updatedUser);
        setUserCookie(updatedUser);
        setUser(updatedUser);
      } else {
        setUser(userData);
      }
    }
  };

  useEffect(() => {
    checkUserAndCredits();

    // Set up periodic credit check
    const creditCheckInterval = setInterval(checkUserAndCredits, 10000);

    // Listen for storage changes and credit updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkUserAndCredits();
      }
    };

    const handleCreditUpdate = () => {
      checkUserAndCredits();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("creditUpdate", handleCreditUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("creditUpdate", handleCreditUpdate);
      clearInterval(creditCheckInterval);
    };
  }, []);

  // Close mobile menu when clicking outside or navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    // Handle document body overflow for mobile menu
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isMobileMenuOpen]);

  const login = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response as TokenInfo),
    onError: (error) => console.error("Login Failed:", error),
    scope: "email profile",
  });

  const GetUserProfile = async (tokenInfo: TokenInfo) => {
    try {
      const response = await axios.get<User>(
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
        plan: firestoreUser.plan,
      };

      // Store user data in both localStorage and cookie
      setUserStorage(userWithCredits);
      setUserCookie(userWithCredits);
      setUser(userWithCredits);
      setOpenDialog(false);
      setIsMobileMenuOpen(false);

      // Dispatch auth change event
      window.dispatchEvent(new Event("auth-change"));
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleLogout = () => {
    clearUserAuth();
    setUser(null);
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const renderUserMenu = () => (
    <>
      <Link href="/pricing">
        <Button
          variant="outline"
          className="text-foreground hover:bg-accent transition-colors duration-200"
        >
          💰 {user?.credits ?? 0} Credits
        </Button>
      </Link>
      <Link href="/create-trip">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:shadow-indigo-600/40">
          ✨ Create Trip
        </Button>
      </Link>
      <Link href="/my-trips">
        <Button
          variant="ghost"
          className="text-foreground hover:bg-accent transition-colors duration-200"
        >
          My Trips
        </Button>
      </Link>
      <Popover>
        <PopoverTrigger>
          <div className="relative group">
            <Image
              src={user?.picture || ""}
              width={40}
              height={40}
              className="rounded-full cursor-pointer border-2 border-border/40 transition-all duration-200 group-hover:border-indigo-600 group-hover:scale-105"
              alt={user?.name || "User"}
            />
            <div className="absolute inset-0 rounded-full bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-background/95 backdrop-blur-sm border-border/40 shadow-xl">
          <div className="p-3">
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
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
    </>
  );

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 gap-0 h-16">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={user ? "/my-trips" : "/"}
          className="flex items-center group"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer transition-transform duration-200 group-hover:scale-110"
          />
          <span className="ml-3 text-foreground font-bold text-lg">TripAI</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -mr-2 hover:bg-accent/80 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-6">
          {user ? (
            renderUserMenu()
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex -top-2 flex-col">
          <div className="flex justify-between items-center p-4 border-b border-border/40">
            <Link
              href={user ? "/my-trips" : "/"}
              className="flex items-center group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="cursor-pointer transition-transform duration-200 group-hover:scale-110"
              />
              <span className="ml-3 text-foreground font-bold text-lg">
                TripAI
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-accent/80 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>

          <div className="flex-1 transition-all bg-black">
            <div className="flex flex-col items-center gap-6 p-6 pt-12">
              {user ? (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      <Image
                        src={user.picture}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-indigo-600 shadow-lg transition-transform duration-200 group-hover:scale-105"
                        alt={user.name}
                      />
                      <div className="absolute inset-0 rounded-full bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    <p className="mt-4 font-medium text-lg text-foreground">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.email}
                    </p>
                  </div>

                  <Link href="/pricing" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full text-foreground hover:bg-accent/80 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      💰 {user.credits ?? 0} Credits
                    </Button>
                  </Link>

                  <Link href="/create-trip" className="w-full">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ✨ Create Trip
                    </Button>
                  </Link>

                  <Link href="/my-trips" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full text-foreground hover:bg-accent/80 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Trips
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full mt-6 hover:bg-accent/80 text-foreground transition-all duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setOpenDialog(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all duration-200"
                >
                  🚀 Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <CustomDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Sign in with Google"
        description="Sign in to TripAI with Google for a seamless travel planning experience."
      >
        <Button
          onClick={() => login()}
          className="w-full mt-5 flex gap-4 items-center bg-background hover:bg-accent text-foreground transition-colors duration-200"
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </Button>
      </CustomDialog>
    </header>
  );
}
