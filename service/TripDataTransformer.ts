import { EGYPT_IMAGES } from './constants';

interface Place {
  placeName: string;
  "Place Details": string;
  rating: number;
  approximate_time: string;
  image_url?: string;
}

interface Hotel {
  HotelName: string;
  HotelAddress: string;
  Price: string;
  rating: number;
  description: string;
  image_url?: string;
}

interface TripData {
  userSelection: {
    location: {
      label: string;
    };
    startDate: string;
    endDate: string;
    noOfDays: number;
    budget: string;
    travellingWith: string;
  };
  tripData: {
    hotel_options: Hotel[];
    itinerary: Record<string, {
      theme: string;
      best_time_to_visit: string;
      places: Place[];
    }>;
  };
}

export function transformTripData(tripData: TripData): TripData {
  const imageMap = new Map([
    // Hotels
    ['Four Seasons Hotel Cairo at Nile Plaza', EGYPT_IMAGES.fourSeasonsCairo],
    ['The St. Regis Cairo', EGYPT_IMAGES.stRegisCairo],
    ['The Oberoi Mena House, Cairo', EGYPT_IMAGES.menaHouse],

    // Places
    ['Giza Pyramids & Sphinx', EGYPT_IMAGES.gizaPyramids],
    ['Egyptian Museum', EGYPT_IMAGES.egyptianMuseum],
    ['Dinner Cruise on the Nile', EGYPT_IMAGES.nileCruise],
    ['Coptic Cairo', EGYPT_IMAGES.copticCairo],
    ['Khan el-Khalili Bazaar', EGYPT_IMAGES.khanElKhalili],
    ['Alabaster Mosque (Mosque of Muhammad Ali)', EGYPT_IMAGES.alabasterMosque],
    ['Karnak Temple', EGYPT_IMAGES.karnakTemple],
    ['Luxor Temple', EGYPT_IMAGES.luxorTemple],
    ['Valley of the Kings', EGYPT_IMAGES.valleyOfKings],
    ['Hatshepsut Temple', EGYPT_IMAGES.hatshepsutTemple],
    ['Colossi of Memnon', EGYPT_IMAGES.colossiMemnon],
    ['Fly to Luxor', EGYPT_IMAGES.luxorAirport],
    ['Departure from Luxor', EGYPT_IMAGES.luxorAirport],
  ]);

  // Transform hotel images
  tripData.tripData.hotel_options = tripData.tripData.hotel_options.map(hotel => ({
    ...hotel,
    image_url: imageMap.get(hotel.HotelName) || hotel.image_url
  }));

  // Transform place images in itinerary
  Object.keys(tripData.tripData.itinerary).forEach(day => {
    tripData.tripData.itinerary[day].places = tripData.tripData.itinerary[day].places.map(place => ({
      ...place,
      image_url: imageMap.get(place.placeName) || place.image_url
    }));
  });

  return tripData;
}