"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { Loader } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Place {
  placeName: string;
  placeDetails: string;
  rating: number;
  approximate_time: string;
}

interface TripMapProps {
  center: string;
  selectedPlace?: string | null;
  places: Place[];
}

// Initialize Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function TripMap({ center, selectedPlace, places }: TripMapProps): ReactNode {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Geocode the center location
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(center)}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        if (!data.features?.length) {
          throw new Error("Location not found");
        }

        const [lng, lat] = data.features[0].center;

        // Create map instance
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [lng, lat],
          zoom: 12
        });

        // Save map instance
        mapInstanceRef.current = map;

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
          setLoading(false);
        });

      } catch (error) {
        console.error("Error initializing map:", error);
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [center]);

  // Handle markers
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !places.length) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();

      // Create markers for all places
      for (const [index, place] of places.entries()) {
        try {
          // Geocode the place
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place.placeName + " " + center)}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          if (data.features?.length) {
            const [lng, lat] = data.features[0].center;

            // Create marker element
            const el = document.createElement("div");
            el.className = "flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-semibold";
            el.textContent = String(index + 1);

            // Create and add marker
            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-semibold">${place.placeName}</h3>
                      <p class="text-sm mt-1">${place.placeDetails}</p>
                      <p class="text-sm mt-1">⭐ ${place.rating} | ⏱️ ${place.approximate_time}</p>
                    </div>
                  `)
              )
              .addTo(mapInstanceRef.current);

            markersRef.current.push(marker);
            bounds.extend([lng, lat]);
          }
        } catch (error) {
          console.error("Error creating marker:", error);
        }
      }

      // Fit map to bounds if there are markers
      if (markersRef.current.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 14
        });
      }
    };

    updateMarkers();
  }, [places, center]);

  // Handle selected place
  useEffect(() => {
    const handleSelectedPlace = async () => {
      if (!mapInstanceRef.current || !selectedPlace) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(selectedPlace + " " + center)}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features?.length) {
          const [lng, lat] = data.features[0].center;

          mapInstanceRef.current.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true
          });

          // Find and highlight the selected marker
          markersRef.current.forEach(marker => {
            const el = marker.getElement();
            if (el) {
              if (marker.getLngLat().lng === lng && marker.getLngLat().lat === lat) {
                el.style.backgroundColor = "var(--primary)";
                el.style.transform = "scale(1.2)";
              } else {
                el.style.backgroundColor = "";
                el.style.transform = "";
              }
            }
          });
        }
      } catch (error) {
        console.error("Error handling selected place:", error);
      }
    };

    handleSelectedPlace();
  }, [selectedPlace, center]);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}