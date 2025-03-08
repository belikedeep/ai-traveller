import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { tripId } = await props.params;
  return {
    title: `Trip ${tripId} | TripAI`,
    description: `View this AI-generated travel itinerary for trip ${tripId}.`,
  };
}
