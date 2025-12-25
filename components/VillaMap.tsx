'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface VillaMapProps {
    latitude: number
    longitude: number
    villaName: string
    location?: string
}

export default function VillaMap({ latitude, longitude, villaName, location }: VillaMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [latitude, longitude],
            zoom: 15,
            scrollWheelZoom: false,
        })

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Custom marker icon
        const customIcon = L.divIcon({
            className: 'custom-villa-marker',
            html: `
                <div style="
                    width: 48px;
                    height: 48px;
                    background: #5D8736;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    border: 3px solid white;
                ">
                    <svg style="transform: rotate(45deg); width: 20px; height: 20px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48]
        })

        // Add marker
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map)

        // Popup content
        marker.bindPopup(`
            <div style="padding: 8px; min-width: 150px;">
                <h3 style="margin: 0 0 4px; font-weight: 600; color: #1f2937;">${villaName}</h3>
                ${location ? `<p style="margin: 0; color: #6b7280; font-size: 12px;">${location}</p>` : ''}
            </div>
        `)

        mapInstanceRef.current = map
        setIsLoaded(true)

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [latitude, longitude, villaName, location])

    // Update map center if coordinates change
    useEffect(() => {
        if (mapInstanceRef.current && isLoaded) {
            mapInstanceRef.current.setView([latitude, longitude], 15)
        }
    }, [latitude, longitude, isLoaded])

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-[400px] z-0"
                style={{ background: '#f3f4f6' }}
            />
            {/* Overlay for style */}
            <div className="absolute inset-0 pointer-events-none border border-gray-200" />
        </div>
    )
}
