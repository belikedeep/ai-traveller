"use client";

import { Button } from "@/components/ui/button";
import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import { useEffect, useState } from "react";

interface TripProps {
  trip: {
    userSelection: {
      location: {
        label: string;
      };
      noOfDays: number;
      budget: string;
      travellingWith: string;
    };
  };
}

export default function InfoSection({ trip }: TripProps) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    if (trip?.userSelection.location.label) {
      fetchPlacePhoto();
    }
  }, [trip]);

  const fetchPlacePhoto = async () => {
    try {
      const locationName = trip?.userSelection.location.label;
      const result = await GetPlaceDetails(locationName);
      const place = result.data?.results?.[0];

      if (place?.photos?.[0]?.photo_reference) {
        const photoRef = place.photos[0].photo_reference;
        const url = GetPlacePhoto(photoRef);
        if (url) {
          setPhotoUrl(url);
        }
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  return (
    <div>
      <img
        src={photoUrl}
        alt={trip?.userSelection.location.label || "trip"}
        className="h-[340px] w-full object-cover rounded"
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="text-lg text-gray-500 mt-1">
            {trip?.userSelection.location.label}
          </h2>
          <div className="flex gap-2">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              {trip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              No. of travelers: {trip?.userSelection?.travellingWith}
            </h2>
          </div>
        </div>

        <Button>Share</Button>
      </div>
    </div>
  );
}
