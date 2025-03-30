"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  Star,
  MapPin,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { addDays, format } from "date-fns";

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
      startDate: string;
      noOfDays: number;
    };
  };
}

function PlacesToVisit({ trip }: TripProps) {
  const [placePhotos, setPlacePhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const memoizedTrip = useMemo(() => trip, [trip]);
  const memoizedItinerary = useMemo(
    () => memoizedTrip?.tripData?.itinerary || {},
    [memoizedTrip?.tripData?.itinerary]
  );
  const memoizedDays = useMemo(() => {
    const days = Object.entries(memoizedTrip?.tripData?.itinerary || {});
    return days.sort((a, b) => {
      const dayNumA = parseInt(a[0].replace("Day ", ""));
      const dayNumB = parseInt(b[0].replace("Day ", ""));
      return dayNumA - dayNumB;
    });
  }, [memoizedTrip]);

  const getDateForDay = useCallback(
    (dayNumber: number) => {
      try {
        if (!trip?.userSelection?.startDate) return null;
        const startDate = new Date(trip.userSelection.startDate);
        if (isNaN(startDate.getTime())) return null; // Check if date is valid
        return addDays(startDate, dayNumber - 1);
      } catch (error) {
        console.error("Error calculating date:", error);
        return null;
      }
    },
    [trip?.userSelection?.startDate]
  );

  const formatDate = useCallback((date: Date | null) => {
    try {
      if (!date || isNaN(date.getTime())) return "";
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }, []);

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
    if (Object.keys(memoizedItinerary).length > 0) {
      fetchPlacePhotos();
    }
  }, [memoizedItinerary, fetchPlacePhotos]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          Your Travel Itinerary
        </h2>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
      </div>

      <div className="space-y-8">
        {memoizedDays.map(([dayKey, dayData]: [string, DayData]) => {
          const dayNumber = parseInt(dayKey.replace("Day ", ""));
          const date = getDateForDay(dayNumber);
          const formattedDate = formatDate(date);

          return (
            <div
              key={dayKey}
              className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50"
            >
              <div className="p-6 border-b border-border/50 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">
                    {dayKey}
                    {formattedDate ? ` - ${formattedDate}` : ""}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>Theme: {dayData.theme}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Best Time: {dayData.best_time_to_visit}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {dayData.places.map((place: Place, index: number) => (
                  <div
                    key={index}
                    className="group-hover:transform group-hover:scale-[1.02] transition-transform duration-300"
                  >
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        place.placeName
                      )}`}
                      target="_blank"
                      className="block group"
                    >
                      <div className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                        <div className="relative aspect-video">
                          <div className="absolute inset-0 z-10" />
                          {loading ? (
                            <div className="absolute inset-0 bg-background animate-pulse" />
                          ) : (
                            <Image
                              src={
                                placePhotos[place.placeName] ||
                                "/placeholder.jpg"
                              }
                              alt={place.placeName}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute top-3 right-3 z-20">
                            <div className="flex items-center gap-1 text-sm bg-background/90 px-2 py-1 rounded-full backdrop-blur-sm border border-border/50">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span>{place.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                              {place.placeName}
                            </h4>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="line-clamp-2">{place.placeDetails}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                            <Clock className="h-4 w-4" />
                            <span>{place.travelTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(PlacesToVisit);
