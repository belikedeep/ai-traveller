import type { NextPage } from "next";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ tripId: string }>;
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { tripId } = await params;
  redirect(`/create-trip?tripId=${tripId}`);
  return null;
};

export default Page;
