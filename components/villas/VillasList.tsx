'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Villa } from '@/types'
import VillaCard from '@/components/VillaCard'
import { SlidersHorizontal, X } from 'lucide-react'
import { VillaCardSkeleton } from '@/components/Skeleton'

export default function VillasList() {
    const supabase = createClient()
    const [villas, setVillas] = useState<Villa[]>([])
    const [filteredVillas, setFilteredVillas] = useState<Villa[]>([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)

    // Filters
    const [maxPrice, setMaxPrice] = useState<number>(0)
    const [minGuests, setMinGuests] = useState<number>(0)
    const [bedrooms, setBedrooms] = useState<number>(0)

    useEffect(() => {
        fetchVillas()
    }, [])

    async function fetchVillas() {
        const { data, error } = await supabase
            .from('villas')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setVillas(data)
            setFilteredVillas(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        let filtered = [...villas]

        if (maxPrice > 0) {
            filtered = filtered.filter(v => v.price_per_night <= maxPrice)
        }
        if (minGuests > 0) {
            filtered = filtered.filter(v => v.max_guests >= minGuests)
        }
        if (bedrooms > 0) {
            filtered = filtered.filter(v => v.bedrooms >= bedrooms)
        }

        setFilteredVillas(filtered)
    }, [maxPrice, minGuests, bedrooms, villas])

    const clearFilters = () => {
        setMaxPrice(0)
        setMinGuests(0)
        setBedrooms(0)
    }

    const hasFilters = maxPrice > 0 || minGuests > 0 || bedrooms > 0

    if (loading) {
        return (
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <VillaCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-primary/10 animate-fade-up">
                <p className="text-muted">
                    {filteredVillas.length} {filteredVillas.length === 1 ? 'property' : 'properties'} available
                </p>

                <div className="flex items-center gap-4">
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-1"
                        >
                            <X size={14} />
                            Clear
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-primary px-4 py-2 border border-primary/20 hover:bg-primary hover:text-white transition-all"
                    >
                        <SlidersHorizontal size={16} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Filters Panel - CSS transition */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-primary/10">
                    <div>
                        <label className="block text-sm text-muted mb-3 tracking-wide">
                            Max Price (per night)
                        </label>
                        <select
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-transparent border border-primary/20 text-primary focus:border-primary outline-none transition-colors"
                        >
                            <option value={0}>Any price</option>
                            <option value={3000000}>Under IDR 3,000,000</option>
                            <option value={5000000}>Under IDR 5,000,000</option>
                            <option value={8000000}>Under IDR 8,000,000</option>
                            <option value={10000000}>Under IDR 10,000,000</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-3 tracking-wide">
                            Minimum Guests
                        </label>
                        <select
                            value={minGuests}
                            onChange={(e) => setMinGuests(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-transparent border border-primary/20 text-primary focus:border-primary outline-none transition-colors"
                        >
                            <option value={0}>Any</option>
                            <option value={2}>2+ guests</option>
                            <option value={4}>4+ guests</option>
                            <option value={6}>6+ guests</option>
                            <option value={8}>8+ guests</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-3 tracking-wide">
                            Bedrooms
                        </label>
                        <select
                            value={bedrooms}
                            onChange={(e) => setBedrooms(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-transparent border border-primary/20 text-primary focus:border-primary outline-none transition-colors"
                        >
                            <option value={0}>Any</option>
                            <option value={1}>1+ bedroom</option>
                            <option value={2}>2+ bedrooms</option>
                            <option value={3}>3+ bedrooms</option>
                            <option value={4}>4+ bedrooms</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Villas Grid */}
            {filteredVillas.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-muted text-lg mb-4">No properties match your criteria</p>
                    <button
                        onClick={clearFilters}
                        className="text-primary underline hover:no-underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {filteredVillas.map((villa, index) => (
                        <VillaCard key={villa.id} villa={villa} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}
