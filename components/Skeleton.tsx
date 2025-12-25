interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
    width?: string | number
    height?: string | number
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const baseClasses = 'skeleton'

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded',
    }

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    )
}

// Villa Card Skeleton
export function VillaCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 overflow-hidden">
            {/* Image */}
            <Skeleton height={280} className="w-full" />

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <Skeleton variant="text" height={24} width="70%" />

                {/* Location */}
                <Skeleton variant="text" height={16} width="40%" />

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="80%" />
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={80} />
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Skeleton variant="text" width={120} height={28} />
                    <Skeleton variant="rectangular" width={100} height={40} />
                </div>
            </div>
        </div>
    )
}

// Experience Card Skeleton
export function ExperienceCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 overflow-hidden">
            <Skeleton height={240} className="w-full" />
            <div className="p-5 space-y-3">
                <Skeleton variant="text" height={20} width="80%" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="90%" />
                <div className="flex gap-2 pt-2">
                    <Skeleton variant="rectangular" width={60} height={24} />
                    <Skeleton variant="rectangular" width={80} height={24} />
                </div>
            </div>
        </div>
    )
}

// Text Block Skeleton
export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? '70%' : '100%'}
                />
            ))}
        </div>
    )
}

// Gallery Skeleton
export function GallerySkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} height={200} className="w-full" />
            ))}
        </div>
    )
}
