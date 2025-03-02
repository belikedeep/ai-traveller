"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectBudgetOptions,
  SelectedTravelsList,
  AI_PROMPT,
} from "@/constants/Options";
import { chatSession } from "@/service/AIModel";
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import type { SingleValue } from "react-select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { MdLocationOn, MdCalendarMonth } from "react-icons/md";
import { FaMoneyBillWave, FaUsers, FaPlaneDeparture } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useRouter } from "next/navigation";
import {
  updateUserCredits,
  getUser,
  CREDIT_COSTS,
} from "@/service/UserService";

interface GooglePlaceData {
  label: string;
  value: {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  };
}

interface FormData {
  location?: GooglePlaceData;
  noOfDays?: number;
  budget?: string;
  travellingWith?: string;
}

interface UserProfile {
  email: string;
  name: string;
  picture: string;
  credits?: number;
}

interface TokenInfo {
  access_token: string;
}

export default function CreateTripPage() {
  const [place, setPlace] = useState<GooglePlaceData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const router = useRouter();

  const handleInputChange = (
    name: string,
    value: string | number | GooglePlaceData
  ) => {
    if (name === "noOfDays" && Number(value) > 5) {
      toast.error("You can't plan a trip for more than 5 days");
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (response) => GetUserProfile(response as TokenInfo),
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Login failed. Please try again.");
    },
    scope: "email profile",
  });

  const OnGenerateTrip = async () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");

      if (!user) {
        setOpenDialog(true);
        return;
      }

      const userData = JSON.parse(user) as UserProfile;

      // Check if user has enough credits
      const firestoreUser = await getUser(userData.email);
      if (
        !firestoreUser ||
        firestoreUser.credits < CREDIT_COSTS.TRIP_CREATION
      ) {
        toast.error(
          "Insufficient credits. Please purchase more credits to create a trip."
        );
        router.push("/pricing");
        return;
      }

      if (
        !formData?.location ||
        !formData?.noOfDays ||
        !formData?.budget ||
        !formData?.travellingWith
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        formData?.location?.label || ""
      )
        .replace("{totalDays}", formData?.noOfDays?.toString() || "")
        .replace("{traveler}", formData?.travellingWith || "")
        .replace("{budget}", formData?.budget || "");

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      setLoading(false);
      if (result?.response) {
        const tripData = result.response.text();
        await SaveAiTrip(tripData);

        // Deduct credits and update local storage
        const updatedUser = await updateUserCredits(
          userData.email,
          firestoreUser.credits - CREDIT_COSTS.TRIP_CREATION
        );

        if (updatedUser) {
          const updatedLocalUser = {
            ...userData,
            credits: updatedUser.credits,
          };
          localStorage.setItem("user", JSON.stringify(updatedLocalUser));
        }
      }
    }
  };

  const SaveAiTrip = async (TripData: string) => {
    setLoading(true);
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    ) as UserProfile;

    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);

    router.push(`/my-trips/${docId}`);
  };

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
        console.log("User Profile:", res);
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((err: Error) => {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to get user profile. Please try again.");
      });
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.location) {
      toast.error("Please select a destination");
      return;
    }
    if (currentStep === 2 && !formData.noOfDays) {
      toast.error("Please enter number of days");
      return;
    }
    if (currentStep === 3 && !formData.budget) {
      toast.error("Please select a budget");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full bg-background/50 rounded-full h-2.5 mb-10">
        <div
          className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    );
  };

  const customSelectStyles: {
    [key: string]: (
      base: React.CSSProperties,
      state?: { isSelected?: boolean; isFocused?: boolean }
    ) => React.CSSProperties;
  } = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      color: "hsl(var(--foreground))",
      boxShadow: "none",
      "&:hover": {
        borderColor: "hsl(var(--border))",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state?.isSelected
        ? "hsl(var(--primary))"
        : state?.isFocused
        ? "hsl(var(--accent))"
        : "hsl(var(--background))",
      color: state?.isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    input: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
    }),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 md:px-0 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 flex flex-col gap-8">
        <div className="rounded-2xl border border-border/50 backdrop-blur-sm bg-background/50 p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="font-bold text-4xl bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Plan Your Dream Journey
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Let AI create a personalized itinerary just for you
            </p>
            {renderProgressBar()}
          </div>

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <MdLocationOn className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-medium">
                  Where do you want to go?
                </h2>
              </div>
              <div className="rounded-lg ring-1 ring-border/50">
                <GooglePlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                  selectProps={{
                    value: place,
                    onChange: (newValue: SingleValue<GooglePlaceData>) => {
                      if (newValue) {
                        const placeData: GooglePlaceData = {
                          label: newValue.label,
                          value: newValue.value,
                        };
                        setPlace(placeData);
                        handleInputChange("location", placeData);
                      }
                    },
                    styles: customSelectStyles,
                    placeholder: "Search for a destination...",
                  }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Try popular destinations like Paris, Bali, or Tokyo</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <MdCalendarMonth className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-medium">
                  How many days will you stay?
                </h2>
              </div>
              <div>
                <Input
                  placeholder="Number of days (max 5)"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.noOfDays || ""}
                  onChange={(e) =>
                    handleInputChange("noOfDays", parseInt(e.target.value))
                  }
                  className="text-lg"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  We recommend 3-5 days to fully experience most destinations
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <FaMoneyBillWave className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-medium">
                  What&apos;s your budget?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SelectBudgetOptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-5 border rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                      formData?.budget === item.title
                        ? "bg-gradient-to-b from-indigo-500/10 via-background to-background border-indigo-500 shadow-lg shadow-indigo-500/20"
                        : "border-border/50 bg-background/50 hover:border-border"
                    }`}
                  >
                    <div className="text-4xl mb-3 text-indigo-500">
                      {item.icon}
                    </div>
                    <h2 className="font-bold text-lg">{item.title}</h2>
                    <h2 className="text-sm text-muted-foreground">
                      {item.desc}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <FaUsers className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-medium">
                  Who are you traveling with?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SelectedTravelsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      handleInputChange("travellingWith", item.people)
                    }
                    className={`p-5 border rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                      formData?.travellingWith === item.people
                        ? "bg-gradient-to-b from-indigo-500/10 via-background to-background border-indigo-500 shadow-lg shadow-indigo-500/20"
                        : "border-border/50 bg-background/50 hover:border-border"
                    }`}
                  >
                    <div className="text-4xl mb-3 text-indigo-500">
                      {item.icon}
                    </div>
                    <h2 className="font-bold text-lg">{item.title}</h2>
                    <h2 className="text-sm text-muted-foreground">
                      {item.desc}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <Button variant="default" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button
                disabled={loading}
                variant="premium"
                onClick={OnGenerateTrip}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating your perfect trip...
                  </>
                ) : (
                  <>
                    <FaPlaneDeparture />
                    Generate My Trip Plan
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Summary card that shows selected options */}
        {Object.keys(formData).length > 0 && (
          <div className="mt-8 rounded-2xl border border-border/50 backdrop-blur-sm bg-background/50 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-medium mb-4">Your Trip Summary</h3>
            <div className="space-y-3">
              {formData.location && (
                <div className="flex items-center gap-3">
                  <MdLocationOn className="text-indigo-500" />
                  <span className="text-muted-foreground">
                    Destination:{" "}
                    <span className="text-foreground">
                      {formData.location.label}
                    </span>
                  </span>
                </div>
              )}
              {formData.noOfDays && (
                <div className="flex items-center gap-3">
                  <MdCalendarMonth className="text-indigo-500" />
                  <span className="text-muted-foreground">
                    Duration:{" "}
                    <span className="text-foreground">
                      {formData.noOfDays} day{formData.noOfDays > 1 ? "s" : ""}
                    </span>
                  </span>
                </div>
              )}
              {formData.budget && (
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-indigo-500" />
                  <span className="text-muted-foreground">
                    Budget:{" "}
                    <span className="text-foreground">{formData.budget}</span>
                  </span>
                </div>
              )}
              {formData.travellingWith && (
                <div className="flex items-center gap-3">
                  <FaUsers className="text-indigo-500" />
                  <span className="text-muted-foreground">
                    Traveling with:{" "}
                    <span className="text-foreground">
                      {formData.travellingWith}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-sm border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sign in with Google</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <p>Sign in to create and save your trip plans</p>

              <Button
                onClick={() => login()}
                className="w-full mt-5 flex gap-4 items-center bg-background hover:bg-accent text-foreground"
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
