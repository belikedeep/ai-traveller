import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  return {
    title: `Trip ${params.tripId} | AI Travel Planner`,
    description: `View this AI-generated travel itinerary.`,
  };
}

export default function Page({ params }) {
  redirect(`/my-trips/${params.tripId}`);
}
