'use client'

import {
    MapPin,
    Waves,
    Landmark,
    Utensils,
    ShoppingBag,
    Plane,
    Mountain,
    Building
} from 'lucide-react'
import { NearbyPlace } from '@/types'

interface NearbyPlacesProps {
    places: NearbyPlace[]
}

const placeIcons: Record<string, React.ElementType> = {
    beach: Waves,
    temple: Landmark,
    attraction: Mountain,
    restaurant: Utensils,
    shopping: ShoppingBag,
    landmark: Building,
    airport: Plane,
    other: MapPin,
}

const placeColors: Record<string, string> = {
    beach: 'bg-blue-100 text-blue-600',
    temple: 'bg-purple-100 text-purple-600',
    attraction: 'bg-green-100 text-green-600',
    restaurant: 'bg-orange-100 text-orange-600',
    shopping: 'bg-pink-100 text-pink-600',
    landmark: 'bg-amber-100 text-amber-600',
    airport: 'bg-gray-100 text-gray-600',
    other: 'bg-olive-100 text-olive-600',
}

export default function NearbyPlaces({ places }: NearbyPlacesProps) {
    if (!places || places.length === 0) return null

    return (
        <div>
            <h2 className="font-display text-2xl text-primary mb-6">Nearby Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {places.map((place, index) => {
                    const Icon = placeIcons[place.type] || placeIcons.other
                    const colorClass = placeColors[place.type] || placeColors.other
                    const staggerClass = index < 6 ? `stagger-${index + 1}` : ''

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-4 p-4 border border-gray-100 hover:border-olive-200 transition-colors animate-fade-up ${staggerClass}`}
                        >
                            <div className={`w-10 h-10 flex items-center justify-center ${colorClass}`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-medium text-sm truncate">
                                    {place.name}
                                </p>
                                <p className="text-gray-400 text-xs capitalize">
                                    {place.type.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="text-olive-600 text-sm font-medium whitespace-nowrap">
                                {place.distance}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
