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

async function getTripData(tripId: string): Promise<TripData | null> {
  try {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as TripData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
}

export default async function ViewTripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { tripId } = await params;
  const tripData = await getTripData(tripId);

  if (!tripData) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  return (
    <div className="p-10 md:px-20 lg:px-40 xl:px-56">
      <InfoSection trip={tripData} />
      <div className="mt-10">
        <Hotels trip={tripData} />
      </div>
      <div className="mt-10">
        <PlacesToVisit trip={tripData} />
      </div>
    </div>
  );
}
