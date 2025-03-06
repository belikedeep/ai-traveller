import { Metadata, ResolvingMetadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";

interface TripData {
  userSelection: {
    location: {
      label: string;
    };
    noOfDays: number;
  };
}

interface Props {
  params: { tripId: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const tripRef = doc(db, "AITrips", params.tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      return {
        title: "Trip Not Found | AI Travel Planner",
        description: "The requested trip could not be found.",
      };
    }

    const tripData = tripSnap.data() as TripData;
    const location = tripData.userSelection.location.label;
    const days = tripData.userSelection.noOfDays;

    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${location} Trip Plan - ${days} Day${
        days > 1 ? "s" : ""
      } | AI Travel Planner`,
      description: `View this AI-generated ${days}-day travel itinerary for ${location}. Get personalized hotel recommendations, places to visit, and more.`,
      openGraph: {
        title: `${days}-Day ${location} Trip Itinerary`,
        description: `Check out this AI-crafted travel plan for ${location}, featuring carefully selected hotels, attractions, and daily activities.`,
        type: "article",
        images: previousImages,
      },
      twitter: {
        card: "summary_large_image",
        title: `${location} in ${days} Days - AI Travel Plan`,
        description: `Discover a personalized ${days}-day travel itinerary for ${location}, created by AI.`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Travel Itinerary | AI Travel Planner",
      description:
        "View AI-generated travel itineraries and plan your next adventure.",
    };
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
