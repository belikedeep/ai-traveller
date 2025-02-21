"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GetHotelDetails, GetPlacePhoto } from "@/service/GlobalAPI";

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

export default function Hotels({ trip }: TripProps) {
  const [hotelPhotos, setHotelPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trip?.tripData.hotel_options) {
      fetchHotelPhotos();
    }
  }, [trip]);

  const fetchHotelPhotos = async () => {
    setLoading(true);
    try {
      const photos: Record<string, string> = {};
      for (const hotel of trip.tripData.hotel_options) {
        const result = await GetHotelDetails(
          hotel.hotelName,
          trip?.userSelection.location.label
        );

        if (result.data?.results?.[0]?.photos?.[0]?.photo_reference) {
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
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Hotels Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {trip?.tripData.hotel_options.map((hotel, index) => (
          <Link
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hotel.hotelName
            )}`}
            target="_blank"
          >
            <div
              className={`p-4 border rounded-lg hover:shadow-md ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <img
                src={hotelPhotos[hotel.hotelName] || "/placeholder.jpg"}
                alt={hotel.hotelName}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2">{hotel?.hotelName}</h2>
              <h2 className="text-sm text-gray-600">{hotel?.hotelAddress}</h2>
              <h2 className="text-sm font-medium mt-1">{hotel?.price}</h2>
              <h2 className="text-sm text-gray-600">Rating: {hotel?.rating}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
