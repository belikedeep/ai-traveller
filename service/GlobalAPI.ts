import axios from "axios";

export const GetPlaceDetails = (query: string) => {
  return axios.get("/api/place-details", {
    params: {
      query,
    },
  });
};

export const GetHotelDetails = (hotelName: string, location: string) => {
  return axios.get("/api/place-details", {
    params: {
      query: `${hotelName} hotel in ${location}`,
      type: "lodging",
    },
  });
};

export const GetPlacePhoto = (photoReference: string, maxwidth = 800) => {
  if (!photoReference) return null;
  return `/api/place-photos?maxwidth=${maxwidth}&photo_reference=${photoReference}`;
};
