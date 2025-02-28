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
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useRouter } from "next/navigation";
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
}

interface TokenInfo {
  access_token: string;
}

export default function CreateTripPage() {
  const [place, setPlace] = useState<GooglePlaceData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (
    name: string,
    value: string | number | GooglePlaceData
  ) => {
    if (name === "noOfDays" && Number(value) > 5) {
      return alert("You can't plan a trip for more than 5 days");
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
      toast("Login failed. Please try again.");
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
      if (
        !formData?.location ||
        !formData?.noOfDays ||
        !formData?.budget ||
        !formData?.travellingWith
      ) {
        toast("Please fill all the fields");
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
      SaveAiTrip(result?.response?.text());
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
        toast("Failed to get user profile. Please try again.");
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 my-10">
      <h2 className="font-bold text-4xl">Tell us about your trip</h2>
      <p className="mt-3 text-lg">
        Just provide some basic information about your trip and we&apos;ll take
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
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
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) =>
              handleInputChange("noOfDays", parseInt(e.target.value))
            }
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg hover:shadow-md ${
                formData?.budget === item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          What do you plan on travelling with on your next adventure?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {SelectedTravelsList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInputChange("travellingWith", item.people)}
              className={`p-4 border rounded-lg hover:shadow-md ${
                formData?.travellingWith === item.people &&
                "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? "Loading..." : "Generate Plan"}
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            {/* <Image src="/logo.svg" alt="Logo" width={24} /> */}
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
