"use client";

import { Button } from "@/components/ui/button";
import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";
import { useEffect, useState, useCallback, memo } from "react";

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

import { useMemo } from "react";

function InfoSection({ trip }: TripProps) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  const fetchPlacePhoto = useCallback(async () => {
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
  }, [trip?.userSelection.location.label]);

  useEffect(() => {
    if (trip?.userSelection.location.label) {
      fetchPlacePhoto();
    }
  }, [trip?.userSelection.location.label, fetchPlacePhoto]);

  const memoizedTrip = useMemo(() => trip, [trip]);

  return (
    <div>
      <Image
        width={150}
        height={150}
        src={photoUrl}
        alt={trip?.userSelection.location.label || "trip"}
        className="h-[340px] w-full object-cover rounded"
      />

      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="text-lg text-gray-500 mt-1">
            {memoizedTrip?.userSelection.location.label}
          </h2>
          <div className="flex gap-2">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              {memoizedTrip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              {memoizedTrip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full">
              No. of travelers: {memoizedTrip?.userSelection?.travellingWith}
            </h2>
          </div>
        </div>

        <Button>Share</Button>
      </div>
    </div>
  );
}

export default memo(InfoSection);
