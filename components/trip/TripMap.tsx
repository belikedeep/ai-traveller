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

interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  text: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  context?: Array<{
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }>;
}

interface MapboxResponse {
  type: string;
  features: MapboxFeature[];
}

// Initialize Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function TripMap({ center, selectedPlace, places }: TripMapProps): ReactNode {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Get initial location coordinates
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(center)}.json?` +
          `access_token=${mapboxgl.accessToken}&types=place&limit=1`
        );
        const data = await response.json() as MapboxResponse;

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

        mapInstanceRef.current = map;
        boundsRef.current = new mapboxgl.LngLatBounds();

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

  // Create and manage markers
  useEffect(() => {
    const markerCleanupFns: Array<() => void> = [];
    const addMarkers = async () => {
      if (!mapInstanceRef.current || !places.length) return;

      // Clear existing markers and event listeners
      markerCleanupFns.forEach(cleanup => cleanup());
      markerCleanupFns.length = 0;
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      boundsRef.current = new mapboxgl.LngLatBounds();

      for (const [index, place] of places.entries()) {
        try {
          // Search with city context
          const query = `${place.placeName} ${center}`;
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
            `access_token=${mapboxgl.accessToken}&limit=1`
          );

          const data = await response.json() as MapboxResponse;

          if (data.features?.length) {
            const feature = data.features[0];
            console.log(`Found location for ${place.placeName}:`, feature);

            // Create marker element with explicit place name data
            const el = document.createElement("div");
            el.className = "flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold shadow-lg transition-all duration-300 cursor-pointer border-2 border-white";
            el.innerHTML = `
              <span class="marker-label">${String(index + 1)}</span>
              <span class="sr-only" data-place-name="${place.placeName}">${place.placeName}</span>
            `;
            el.setAttribute('data-place-name', place.placeName);

            // Create marker with click handler
            const marker = new mapboxgl.Marker({
              clickTolerance: 3,
              element: el,
              anchor: 'center'
            })
              .setLngLat(feature.center)
              .setPopup(
                new mapboxgl.Popup({
                  offset: 25,
                  closeOnClick: false,
                  maxWidth: '300px'
                })
                .setHTML(`
                  <div class="p-3">
                    <h3 class="font-semibold text-base mb-2">${place.placeName}</h3>
                    <p class="text-sm mb-2">${place.placeDetails}</p>
                    <p class="text-sm flex items-center gap-2">
                      <span>⭐ ${place.rating}</span>
                      <span>⏱️ ${place.approximate_time}</span>
                    </p>
                  </div>
                `)
              )
              .addTo(mapInstanceRef.current);

            // Add click handler to marker element
            const handleMarkerClick = () => {
              console.log('Marker clicked:', place.placeName);
              
              // Remove existing popups
              markersRef.current.forEach(m => m.getPopup()?.remove());
              
              // Update marker appearances
              markersRef.current.forEach(m => {
                const elem = m.getElement();
                if (elem.getAttribute('data-place-name') === place.placeName) {
                  elem.classList.add('mapboxgl-marker-selected');
                  elem.style.transform = 'scale(1.2)';
                  
                  // Show popup for selected marker
                  m.getPopup()?.addTo(mapInstanceRef.current!);
                } else {
                  elem.classList.remove('mapboxgl-marker-selected');
                  elem.style.transform = 'scale(1)';
                }
              });

              // Center map on clicked marker with offset for popup
              const map = mapInstanceRef.current;
              if (map) {
                const popupHeight = marker.getPopup()?.getElement()?.offsetHeight || 0;
                const offset = popupHeight > 0 ? popupHeight / 2 : 0;
                
                map.easeTo({
                  center: [
                    marker.getLngLat().lng,
                    marker.getLngLat().lat - offset / (Math.pow(2, map.getZoom()) * 10)
                  ],
                  zoom: 15,
                  duration: 1500,
                  essential: true
                });
              }
            };

            el.addEventListener('click', handleMarkerClick);

            // Store cleanup function for marker click handler
            markerCleanupFns.push(() => {
              el.removeEventListener('click', handleMarkerClick);
            });

            markersRef.current.push(marker);
            boundsRef.current.extend(feature.center);
          } else {
            console.warn(`No location found for ${place.placeName}`);
          }
        } catch (error) {
          console.error(`Error creating marker for ${place.placeName}:`, error);
        }
      }

      // Fit bounds with all markers
      if (markersRef.current.length > 0 && boundsRef.current && mapInstanceRef.current) {
        // Add padding based on screen size
        const padding = Math.min(window.innerWidth, window.innerHeight) * 0.2;
        mapInstanceRef.current.fitBounds(boundsRef.current, {
          padding: {
            top: padding,
            bottom: padding,
            left: padding,
            right: padding
          },
          maxZoom: 14
        });
      }
    };

    // Add cleanup function for marker event listeners
    return () => {
      markerCleanupFns.forEach(cleanup => cleanup());
    };

    addMarkers();
  }, [places, center]);

  // Handle selected place
  useEffect(() => {
    console.log('Selected place changed:', selectedPlace);
    console.log('Current markers:', markersRef.current);
    
    if (!mapInstanceRef.current || !selectedPlace || !markersRef.current.length) {
      console.log('Missing required refs or selected place');
      return;
    }

    // Debug: log all marker texts
    markersRef.current.forEach(m => {
      const text = m.getElement().querySelector('.sr-only')?.textContent;
      console.log('Marker text:', text);
    });

    const marker = markersRef.current.find(m => {
      const el = m.getElement();
      const placeName = el.getAttribute('data-place-name');
      console.log('Comparing:', placeName, 'with:', selectedPlace);
      return placeName === selectedPlace;
    });

    console.log('Found marker:', marker);

    if (marker) {
      console.log('Found matching marker, updating appearance');
      
      // Reset all markers with proper state management
      markersRef.current.forEach(m => {
        const el = m.getElement();
        if (el.getAttribute('data-place-name') === selectedPlace) {
          el.classList.add('mapboxgl-marker-selected');
          el.style.transform = 'scale(1.2)';
        } else {
          el.classList.remove('mapboxgl-marker-selected');
          el.style.transform = 'scale(1)';
          m.getPopup()?.remove();
        }
      });

      // Ensure popup is properly shown
      const popupRef = marker.getPopup();
      if (popupRef) {
        popupRef.remove(); // Remove any existing popup
        setTimeout(() => {
          popupRef.addTo(mapInstanceRef.current!); // Add popup back after a brief delay
        }, 50);
      }

      console.log('Flying to marker position:', marker.getLngLat());
      
      // Animate to marker with a slight delay to ensure smooth transition
      setTimeout(() => {
        const map = mapInstanceRef.current;
        if (map) {
          // Get popup height for offset calculation
          const popupHeight = marker.getPopup()?.getElement()?.offsetHeight || 0;
          
          // Calculate offset to center marker and show popup
          const offset = popupHeight > 0 ? popupHeight / 2 : 0;
          
          map.easeTo({
            center: [
              marker.getLngLat().lng,
              marker.getLngLat().lat - offset / (Math.pow(2, map.getZoom()) * 10)
            ],
            zoom: 15,
            duration: 1500,
            essential: true
          });
        }
      }, 100);
    }
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={mapRef} className="absolute inset-0 rounded-lg border border-border/50 overflow-hidden" />
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}