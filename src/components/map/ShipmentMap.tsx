import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShipmentMapProps {
  pickupLocation: {
    name: string;
    city: string;
    lat: number;
    lng: number;
  };
  deliveryLocation: {
    name: string;
    city: string;
    lat: number;
    lng: number;
  };
  currentLocation?: {
    name: string;
    lat: number;
    lng: number;
  };
  status?: string;
  height?: string;
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({
  pickupLocation,
  deliveryLocation,
  currentLocation,
  status = 'IN TRANSIT',
  height = '380px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: [
        (pickupLocation.lat + deliveryLocation.lat) / 2,
        (pickupLocation.lng + deliveryLocation.lng) / 2
      ],
      zoom: 6,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom SVG Pin Icons
    const createCustomIcon = (bgColor: string, text: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${bgColor};
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 2px solid white;
          ">
            <span>${text}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });
    };

    const createTruckIcon = () => {
      return L.divIcon({
        className: 'truck-map-marker',
        html: `
          <div style="
            background-color: #FF6B00;
            color: white;
            padding: 6px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 15px rgba(255,107,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Add Pickup Marker
    const pickupMarker = L.marker([pickupLocation.lat, pickupLocation.lng], {
      icon: createCustomIcon('#2563EB', `📦 Pickup: ${pickupLocation.city}`)
    }).addTo(map);
    pickupMarker.bindPopup(`<b>Pickup Location:</b><br/>${pickupLocation.name}`);

    // Add Delivery Marker
    const deliveryMarker = L.marker([deliveryLocation.lat, deliveryLocation.lng], {
      icon: createCustomIcon('#10B981', `🏁 Drop: ${deliveryLocation.city}`)
    }).addTo(map);
    deliveryMarker.bindPopup(`<b>Delivery Destination:</b><br/>${deliveryLocation.name}`);

    // Current location coordinates (or midway if in transit and no coordinates)
    const currentLat = currentLocation?.lat || (pickupLocation.lat + (deliveryLocation.lat - pickupLocation.lat) * 0.6);
    const currentLng = currentLocation?.lng || (pickupLocation.lng + (deliveryLocation.lng - pickupLocation.lng) * 0.6);

    const isDelivered = status === 'DELIVERED';
    const isTransit = ['IN TRANSIT', 'OUT FOR DELIVERY', 'PICKED UP'].includes(status);

    if (isTransit) {
      const truckMarker = L.marker([currentLat, currentLng], {
        icon: createTruckIcon()
      }).addTo(map);
      truckMarker.bindPopup(`<b>Live Status:</b> ${status}<br/><b>Current Checkpoint:</b> ${currentLocation?.name || 'Highway Corridor'}`);
    }

    // Route Polyline
    const routePoints: L.LatLngExpression[] = [
      [pickupLocation.lat, pickupLocation.lng],
      ...(isTransit ? [[currentLat, currentLng] as [number, number]] : []),
      [deliveryLocation.lat, deliveryLocation.lng]
    ];

    const polyline = L.polyline(routePoints, {
      color: isDelivered ? '#10B981' : '#FF6B00',
      weight: 4,
      dashArray: isDelivered ? undefined : '6, 8',
      opacity: 0.85
    }).addTo(map);

    // Fit Bounds
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    return () => {
      map.remove();
    };
  }, [pickupLocation, deliveryLocation, currentLocation, status]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-sm z-[1000] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        <span>Route: {pickupLocation.city} &rarr; {deliveryLocation.city}</span>
      </div>
    </div>
  );
};

