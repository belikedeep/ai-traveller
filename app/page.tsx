import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center mx-56 gap-9">
      <h2 className="text-[60px] font-extrabold text-center mt-10">
        <span className="text-red-500">
          Discover Your Next Adventure with AI:
        </span>{" "}
        Personalized itineraries at your fingertips
      </h2>
      <p className="text-xl text-center">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus enim
        tempore quibusdam, assumenda ex modi error architecto, optio sit,
        eligendi dignissimos doloremque. Nisi, ex quibusdam sunt hic recusandae
        sapiente laborum.
      </p>
      <Link href="/create-trip">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
