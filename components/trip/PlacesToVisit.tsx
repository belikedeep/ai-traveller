"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useEffect, useState, useCallback, memo } from "react";
import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";

interface Place {
  placeName: string;
  placeDetails: string;
  rating: number;
  travelTime: string;
}

interface DayData {
  theme: string;
  best_time_to_visit: string;
  places: Place[];
}

interface TripProps {
  trip: {
    tripData: {
      itinerary: Record<string, DayData>;
    };
    userSelection: {
      location: {
        label: string;
      };
    };
  };
}

import { useMemo } from "react";

function PlacesToVisit({ trip }: TripProps) {
  const [placePhotos, setPlacePhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Convert itinerary object to array
  const memoizedTrip = useMemo(() => trip, [trip]);
  const memoizedItinerary = useMemo(
    () => memoizedTrip?.tripData?.itinerary || {},
    [memoizedTrip?.tripData?.itinerary]
  );
  const memoizedDays = useMemo(
    () => Object.entries(memoizedTrip?.tripData?.itinerary || {}),
    [memoizedTrip]
  );

  const fetchPlacePhotos = useCallback(async () => {
    setLoading(true);
    try {
      const photos: Record<string, string> = {};
      for (const [, dayData] of memoizedDays) {
        for (const place of dayData.places) {
          const query = `${place.placeName} ${trip?.userSelection.location.label}`;
          const result = await GetPlaceDetails(query);

          if (result?.data?.results?.[0]?.photos?.[0]?.photo_reference) {
            const photoRef = result.data.results[0].photos[0].photo_reference;
            const url = GetPlacePhoto(photoRef);
            if (url) {
              photos[place.placeName] = url;
            }
          }
        }
      }
      setPlacePhotos(photos);
    } catch (error) {
      console.error("Error fetching place photos:", error);
    } finally {
      setLoading(false);
    }
  }, [trip?.userSelection.location.label, memoizedDays]);

  useEffect(() => {
    if (trip?.tripData?.itinerary) {
      fetchPlacePhotos();
    }
  }, [memoizedItinerary, fetchPlacePhotos]);

  return (
    <div>
      <h2 className="text-xl font-bold">Places to Visit</h2>

      <div>
        {memoizedDays.map(([dayKey, dayData]) => (
          <div
            key={dayKey}
            className="p-4 border rounded-lg hover:shadow-md mb-4"
          >
            <h3 className="text-xl font-bold mb-2">{dayKey}</h3>
            <p className="text-md mb-2">Theme: {dayData.theme}</p>
            <p className="text-sm mb-4">
              Best Time: {dayData.best_time_to_visit}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayData.places.map((place, index) => (
                <Link
                  key={index}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    place.placeName
                  )}`}
                  target="_blank"
                >
                  <div
                    className={`border p-3 rounded hover:shadow-md transition ${
                      loading ? "animate-pulse" : ""
                    }`}
                  >
                    <Image
                      width={150}
                      height={150}
                      src={placePhotos[place.placeName] || "/placeholder.jpg"}
                      alt={place.placeName}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <h4 className="font-bold text-lg">{place.placeName}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {place.placeDetails}
                    </p>
                    <p className="text-sm font-medium">
                      Rating: {place.rating}
                    </p>
                    <p className="text-sm text-gray-600">
                      Travel Time: {place.travelTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PlacesToVisit);
