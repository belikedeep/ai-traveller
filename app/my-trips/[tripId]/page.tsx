"use client";

import { use, useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import InfoSection from "@/components/trip/InfoSection";
import Hotels from "@/components/trip/Hotels";
import PlacesToVisit from "@/components/trip/PlacesToVisit";

interface TripData {
  userSelection: {
    location: {
      label: string;
    };
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
          travelTime: string;
        }>;
      }
    >;
  };
}

export default function ViewTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const unwrappedParams = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);

  const getTripData = useCallback(async () => {
    try {
      const docRef = doc(db, "AITrips", unwrappedParams.tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data() as TripData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  }, [unwrappedParams.tripId]);

  useEffect(() => {
    if (unwrappedParams.tripId) {
      getTripData();
    }
  }, [unwrappedParams.tripId, getTripData]);

  if (!trip) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  return (
    <div className="p-10 md:px-20 lg:px-40 xl:px-56">
      <InfoSection trip={trip} />
      <div className="mt-10">
        <Hotels trip={trip} />
      </div>
      <div className="mt-10">
        <PlacesToVisit trip={trip} />
      </div>
    </div>
  );
}
