"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, memo } from "react";
import { GetHotelDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";
import { Star, MapPin, Loader2 } from "lucide-react";

interface HotelOption {
  hotelName: string;
  hotelAddress: string;
  price: string;
  rating: number;
  description: string;
}

interface TripProps {
  trip: {
    tripData: {
      hotel_options: HotelOption[];
    };
    userSelection: {
      location: {
        label: string;
      };
    };
  };
}

function Hotels({ trip }: TripProps) {
  const [hotelPhotos, setHotelPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchHotelPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const photos: Record<string, string> = {};
      for (const hotel of trip.tripData.hotel_options) {
        const result = await GetHotelDetails(
          hotel.hotelName,
          trip?.userSelection.location.label
        );

        if (result?.data?.results?.[0]?.photos?.[0]?.photo_reference) {
          const photoRef = result.data.results[0].photos[0].photo_reference;
          const url = GetPlacePhoto(photoRef);
          if (url) {
            photos[hotel.hotelName] = url;
          }
        }
      }
      setHotelPhotos(photos);
    } catch (error) {
      console.error("Error fetching hotel photos:", error);
    } finally {
      setLoading(false);
    }
  }, [trip?.userSelection.location.label, trip?.tripData.hotel_options]);

  useEffect(() => {
    if (trip?.tripData.hotel_options) {
      fetchHotelPhotos();
    }
  }, [trip?.tripData.hotel_options, fetchHotelPhotos]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          Recommended Hotels
        </h2>
        {loading && (
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trip?.tripData.hotel_options.map((hotel, index) => (
          <div
            key={index}
            className="group-hover:transform group-hover:scale-[1.02] transition-transform duration-300"
          >
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                hotel.hotelName
              )}`}
              target="_blank"
              className="block group"
            >
              <div className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/10">
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  {loading ? (
                    <div className="absolute inset-0 bg-background animate-pulse" />
                  ) : (
                    <Image
                      src={hotelPhotos[hotel.hotelName] || "/placeholder.jpg"}
                      alt={hotel.hotelName}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-sm bg-background/90 px-2 py-1 rounded-full backdrop-blur-sm border border-border/50">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {hotel.hotelName}
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2">{hotel.hotelAddress}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-lg font-semibold text-indigo-500">
                      {hotel.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / night
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Hotels);
