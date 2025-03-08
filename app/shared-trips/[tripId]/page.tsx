import ClientPage from "@/components/shared-trip/ClientPage";

interface PageProps {
<<<<<<< HEAD
  params: Promise<{
    tripId: string;
  }>;
}

// Server Component
export default async function SharedTripPage(props: PageProps) {
  const { tripId } = await props.params;
  return <ClientPage tripId={tripId} />;
}
=======
  params: { tripId: string };
}

const Page = ({ params }: PageProps) => {
  return <ClientPage params={params} />;
};

export default Page;
>>>>>>> 57db0da88481b6a9802b7e687d17a707f3ba8c97
