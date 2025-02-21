import axios from "axios";

const API_CALL_INTERVAL = 500; // milliseconds
let lastApiCallTime = 0;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface ApiParams {
  [key: string]: string | number | boolean;
}

const makeApiCall = async (url: string, params: ApiParams) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;

  if (timeSinceLastCall < API_CALL_INTERVAL) {
    await delay(API_CALL_INTERVAL - timeSinceLastCall);
  }

  try {
    lastApiCallTime = Date.now();
    const response = await axios.get(url, { params });
    return response;
  } catch (error: unknown) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      // Handle specific error codes, e.g., rate limiting
      if (error.response?.status === 429) {
        console.warn("Rate limit exceeded. Please try again later.");
        throw new Error("Rate limit exceeded. Please try again later.");
      }
    }
    throw error; // Re-throw the error for the component to handle
  }
};

export const GetPlaceDetails = (query: string) => {
  return makeApiCall("/api/place-details", { query });
};

export const GetHotelDetails = (hotelName: string, location: string) => {
  return makeApiCall("/api/place-details", {
    query: `${hotelName} hotel in ${location}`,
    type: "lodging",
  });
};

export const GetPlacePhoto = (photoReference: string, maxwidth = 800) => {
  if (!photoReference) return null;
  return `/api/place-photos?maxwidth=${maxwidth}&photo_reference=${photoReference}`;
};
