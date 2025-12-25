'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Villa } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Navigation, X, Bed, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface VillasMapProps {
    villas: Villa[]
}

// Calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

export default function VillasInteractiveMap({ villas }: VillasMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.Marker[]>([])
    const polylineRef = useRef<L.Polyline | null>(null)

    const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null)
    const [compareVilla, setCompareVilla] = useState<Villa | null>(null)
    const [distance, setDistance] = useState<number | null>(null)
    const [isCompareMode, setIsCompareMode] = useState(false)

    // Filter villas with valid coordinates
    const villasWithCoords = villas.filter(v => v.latitude && v.longitude)

    // Calculate center point
    const centerLat = villasWithCoords.length > 0
        ? villasWithCoords.reduce((sum, v) => sum + (v.latitude || 0), 0) / villasWithCoords.length
        : -8.5069
    const centerLng = villasWithCoords.length > 0
        ? villasWithCoords.reduce((sum, v) => sum + (v.longitude || 0), 0) / villasWithCoords.length
        : 115.2625

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [centerLat, centerLng],
            zoom: 13,
            scrollWheelZoom: true,
        })

        // Add tile layer with custom style
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        // Add markers for each villa
        villasWithCoords.forEach((villa) => {
            if (!villa.latitude || !villa.longitude) return

            const customIcon = L.divIcon({
                className: 'custom-villa-marker',
                html: `
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: #5D8736;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        border: 3px solid white;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            })

            // Create marker and add to map
            const villaMarker = L.marker([villa.latitude, villa.longitude], { icon: customIcon })
            villaMarker.addTo(map)

            // Click handler
            villaMarker.on('click', () => {
                setSelectedVilla(villa)
                if (isCompareMode && selectedVilla && selectedVilla.id !== villa.id) {
                    setCompareVilla(villa)
                }
            })

            // Popup
            villaMarker.bindPopup(`
                <div style="padding: 8px; min-width: 180px;">
                    <h3 style="margin: 0 0 4px; font-weight: 600; color: #1f2937; font-size: 14px;">${villa.name}</h3>
                    <p style="margin: 0 0 4px; color: #5D8736; font-size: 12px; font-weight: 500;">${formatCurrency(villa.price_per_night)}/night</p>
                    <p style="margin: 0; color: #6b7280; font-size: 11px;">${villa.bedrooms} beds · ${villa.max_guests} guests</p>
                </div>
            `)

            markersRef.current.push(villaMarker)
        })

        // Fit bounds to show all markers
        if (villasWithCoords.length > 1) {
            const bounds = L.latLngBounds(villasWithCoords.map(v => [v.latitude!, v.longitude!]))
            map.fitBounds(bounds, { padding: [50, 50] })
        }

        mapInstanceRef.current = map

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
                markersRef.current = []
            }
        }
    }, [])

    // Handle distance calculation
    useEffect(() => {
        if (selectedVilla && compareVilla && mapInstanceRef.current) {
            const dist = calculateDistance(
                selectedVilla.latitude!,
                selectedVilla.longitude!,
                compareVilla.latitude!,
                compareVilla.longitude!
            )
            setDistance(dist)

            // Draw line between villas
            if (polylineRef.current) {
                mapInstanceRef.current.removeLayer(polylineRef.current)
            }

            polylineRef.current = L.polyline([
                [selectedVilla.latitude!, selectedVilla.longitude!],
                [compareVilla.latitude!, compareVilla.longitude!]
            ], {
                color: '#5D8736',
                weight: 3,
                dashArray: '10, 10',
                opacity: 0.8
            }).addTo(mapInstanceRef.current)

            // Fit bounds to show both
            const bounds = L.latLngBounds([
                [selectedVilla.latitude!, selectedVilla.longitude!],
                [compareVilla.latitude!, compareVilla.longitude!]
            ])
            mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80] })
        }
    }, [selectedVilla, compareVilla])

    // Clear comparison
    const clearComparison = () => {
        setCompareVilla(null)
        setDistance(null)
        setIsCompareMode(false)
        if (polylineRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(polylineRef.current)
            polylineRef.current = null
        }
    }

    // Start compare mode
    const startCompare = () => {
        setIsCompareMode(true)
        setCompareVilla(null)
        setDistance(null)
    }

    return (
        <div className="relative">
            {/* Map Container */}
            <div
                ref={mapRef}
                className="w-full h-[500px] md:h-[600px] z-0"
                style={{ background: '#f3f4f6' }}
            />

            {/* Villa Count Badge */}
            <div className="absolute top-4 left-4 z-[1000] bg-white px-4 py-2 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-olive-600" />
                    <span className="text-sm font-medium">{villasWithCoords.length} Villas</span>
                </div>
            </div>

            {/* Instructions */}
            {isCompareMode && !compareVilla && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-olive-600 text-white px-6 py-3 shadow-lg">
                    <p className="text-sm">Click on another villa to measure distance</p>
                </div>
            )}

            {/* Distance Result */}
            {distance !== null && selectedVilla && compareVilla && (
                <div className="absolute top-4 right-4 z-[1000] bg-white p-4 shadow-lg border border-gray-100 max-w-xs">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Navigation size={16} className="text-olive-600" />
                            <span className="font-medium text-sm">Distance</span>
                        </div>
                        <button onClick={clearComparison} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                    <p className="font-display text-3xl text-olive-600 mb-1">
                        {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(2)}km`}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                        {selectedVilla.name} → {compareVilla.name}
                    </p>
                    <a
                        href={`https://www.google.com/maps/dir/${selectedVilla.latitude},${selectedVilla.longitude}/${compareVilla.latitude},${compareVilla.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-olive-600 hover:text-olive-800 flex items-center gap-1"
                    >
                        <span>View in Google Maps</span>
                        <ArrowRight size={12} />
                    </a>
                </div>
            )}

            {/* Selected Villa Info Panel */}
            {selectedVilla && (
                <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 z-[1000] bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-display text-lg text-gray-900">{selectedVilla.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} />
                                    {selectedVilla.location}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedVilla(null)
                                    clearComparison()
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                                <Bed size={14} />
                                {selectedVilla.bedrooms} beds
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={14} />
                                {selectedVilla.max_guests} guests
                            </span>
                        </div>

                        <p className="font-display text-xl text-olive-600 mb-4">
                            {formatCurrency(selectedVilla.price_per_night)}
                            <span className="text-sm text-gray-500 font-normal ml-1">/night</span>
                        </p>

                        <div className="flex gap-2">
                            <Link
                                href={`/villas/${selectedVilla.id}`}
                                className="flex-1 text-center bg-olive-600 text-white text-sm py-2 hover:bg-olive-500 transition-colors"
                            >
                                View Details
                            </Link>
                            {!isCompareMode ? (
                                <button
                                    onClick={startCompare}
                                    className="flex-1 text-center border border-gray-300 text-gray-700 text-sm py-2 hover:bg-gray-50 transition-colors"
                                >
                                    Compare Distance
                                </button>
                            ) : (
                                <button
                                    onClick={clearComparison}
                                    className="flex-1 text-center border border-gray-300 text-gray-700 text-sm py-2 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Villa List Sidebar (Desktop) */}
            <div className="hidden lg:block absolute top-4 right-4 bottom-4 w-72 z-[999] bg-white shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-display text-lg text-gray-900">Our Villas</h3>
                    <p className="text-xs text-gray-500">Click to view on map</p>
                </div>
                <div className="h-[calc(100%-60px)] overflow-y-auto">
                    {villasWithCoords.map((villa) => (
                        <button
                            key={villa.id}
                            onClick={() => {
                                setSelectedVilla(villa)
                                if (mapInstanceRef.current && villa.latitude && villa.longitude) {
                                    mapInstanceRef.current.setView([villa.latitude, villa.longitude], 15)
                                }
                            }}
                            className={`w-full text-left p-4 border-b border-gray-50 hover:bg-olive-50 transition-colors ${selectedVilla?.id === villa.id ? 'bg-olive-50 border-l-4 border-l-olive-600' : ''
                                }`}
                        >
                            <p className="font-medium text-gray-900 text-sm">{villa.name}</p>
                            <p className="text-xs text-gray-500">{villa.location}</p>
                            <p className="text-sm text-olive-600 font-medium mt-1">
                                {formatCurrency(villa.price_per_night)}/night
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
