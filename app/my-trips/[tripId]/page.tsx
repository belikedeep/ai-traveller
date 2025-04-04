"use client";

import { use, useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { getDestinationDefaults, updateLocalInfo } from "@/service/LocalInfoService";
import InfoSection from "@/components/trip/InfoSection";
import Hotels from "@/components/trip/Hotels";
import PlacesToVisit from "@/components/trip/PlacesToVisit";
import InfoTab from "@/components/trip/local-info/InfoTab";
import { Loader2 } from "lucide-react";

interface TripData {
  userSelection: {
    location: {
      label: string;
    };
    startDate: string;
    endDate: string;
    noOfDays: number;
    budget: string;
    travellingWith: string;
  };
  tripData: {
    hotel_options: Array<{
      hotelName: string;
      hotelAddress: string;
      price: string;
      rating: number;
      description: string;
    }>;
    itinerary: Record<
      string,
      {
        theme: string;
        best_time_to_visit: string;
        places: Array<{
          placeName: string;
          placeDetails: string;
          rating: number;
          approximate_time: string;
        }>;
      }
    >;
    localInfo?: {
      destination: string;
      countryCode: string;
      localLanguage: string;
      emergencyContacts: Array<{
        name: string;
        number: string;
        icon: "police" | "ambulance" | "embassy" | "touristPolice";
      }>;
      culturalTips: {
        customs: string[];
        etiquette: string[];
        diningTips: string[];
        dressCodes: string[];
      };
      languageHelper: {
        phrases: Array<{
          local: string;
          english: string;
          pronunciation: string;
          category: string;
        }>;
      };
      localGuidelines: {
        transportation: string[];
        safety: string[];
        weather: string[];
        business: string[];
      };
    };
  };
}

export default function ViewTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const unwrappedParams = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isLoadingLocalInfo, setIsLoadingLocalInfo] = useState(true);

  const getTripData = useCallback(async () => {
    try {
      const docRef = doc(db, "AITrips", unwrappedParams.tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = docSnap.data() as TripData;
        console.log("Trip Data:", JSON.stringify(tripData, null, 2));
        setTrip(tripData);

        // Check if local info exists, if not, create it
        if (!tripData.tripData.localInfo) {
          const defaultInfo = getDestinationDefaults(tripData.userSelection.location.label);
          await updateLocalInfo(unwrappedParams.tripId, defaultInfo);
          
          // Fetch updated trip data
          const updatedDoc = await getDoc(docRef);
          if (updatedDoc.exists()) {
            setTrip(updatedDoc.data() as TripData);
          }
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  }, [unwrappedParams.tripId]);

  useEffect(() => {
    if (unwrappedParams.tripId) {
      getTripData().finally(() => {
        setIsLoadingLocalInfo(false);
      });
    }
  }, [unwrappedParams.tripId, getTripData]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-muted-foreground">Loading your trip details...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/5 to-background -z-10" />
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="space-y-12">
          <InfoSection trip={trip} />
          {/* <Hotels trip={trip} /> */}
          <PlacesToVisit trip={trip} />
          <InfoTab
            localInfo={trip.tripData.localInfo || null}
            isLoading={isLoadingLocalInfo}
          />
        </div>
      </div>
    </div>
  );
}
