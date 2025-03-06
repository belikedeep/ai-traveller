import ClientPage from "@/components/shared-trip/ClientPage";

interface PageProps {
  params: { tripId: string };
}

const Page = ({ params }: PageProps) => {
  return <ClientPage params={params} />;
};

export default Page;
