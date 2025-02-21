"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useRouter } from "next/navigation";

interface TripUserSelection {
  location: {
    label: string;
  };
  noOfDays: number;
  budget: string;
  travellingWith: string;
}

interface TripData {
  destination: string;
  totalDays: number;
  budget: string;
  travellingWith: string;
  dailySchedule: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      travelTips: string;
    }>;
  }>;
}

interface Trip {
  id: string;
  userSelection: TripUserSelection;
  tripData: TripData;
  userEmail: string;
}

interface User {
  email: string;
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Move localStorage access to useEffect to avoid SSR issues
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(db, "AITrips"),
          where("userEmail", "==", user?.email)
        );

        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];

        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        Please login to view your trips
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        You haven&apos;t created any trips yet
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/my-trips/${trip.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">
              {trip.userSelection.location.label}
            </h2>
            <p className="text-gray-600">
              {trip.userSelection.noOfDays} days • {trip.userSelection.budget}
            </p>
            <p className="text-gray-500 mt-2">
              Traveling with: {trip.userSelection.travellingWith}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
