import { memo } from 'react'
import Link from 'next/link'
import { Villa } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { ArrowUpRight, Bed, Users, Leaf } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'
import { usePrefetchOnHover } from '@/lib/preload'

interface VillaCardProps {
    villa: Villa
    index?: number
    featured?: boolean
}

/**
 * Optimized VillaCard with React.memo to prevent unnecessary re-renders
 * Only re-renders when villa data changes
 * Uses CSS animations instead of Framer Motion
 */
const VillaCardOptimized = memo(function VillaCard({ villa, index = 0, featured = false }: VillaCardProps) {
    const prefetchProps = usePrefetchOnHover(`/villas/${villa.id}`)
    const staggerClass = index < 6 ? `stagger-${index + 1}` : ''

    return (
        <div className={`group relative animate-fade-up ${staggerClass}`}>
            <Link
                href={`/villas/${villa.id}`}
                className="block"
                {...prefetchProps} // Prefetch on hover
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                    <OptimizedImage
                        src={villa.images[0]}
                        alt={villa.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        priority={index < 3} // Preload first 3 cards
                    />

                    {/* Featured Badge */}
                    {featured && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm">
                            <Leaf size={10} className="text-olive-600" />
                            <span className="text-gray-900 text-[9px] tracking-[0.15em] uppercase font-medium">Featured</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* View Button */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight size={18} className="text-gray-900" />
                    </div>

                    {/* Quick Info on Hover */}
                    <div className="absolute bottom-4 left-4 right-16 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <p className="text-white/80 text-xs">{villa.location}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    {/* Title */}
                    <h3 className="font-display text-xl text-gray-900 group-hover:text-olive-600 transition-colors">
                        {villa.name}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-500">{villa.location}</p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Bed size={14} />
                            {villa.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                            <Users size={14} />
                            {villa.max_guests} Guests
                        </span>
                    </div>

                    {/* Price */}
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-lg font-display text-olive-600">
                            {formatCurrency(villa.price_per_night)}
                            <span className="text-sm text-gray-400 font-body ml-1">/ night</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}, (prevProps, nextProps) => {
    // Custom comparison function
    // Only re-render if villa data actually changed
    return (
        prevProps.villa.id === nextProps.villa.id &&
        prevProps.villa.name === nextProps.villa.name &&
        prevProps.villa.price_per_night === nextProps.villa.price_per_night &&
        prevProps.index === nextProps.index &&
        prevProps.featured === nextProps.featured
    )
})

export default VillaCardOptimized
