export default function VillaCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* Image skeleton */}
            <div className="h-64 skeleton" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
                <div className="h-6 skeleton rounded w-3/4" />
                <div className="space-y-2">
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-5/6" />
                </div>
                <div className="flex space-x-4">
                    <div className="h-5 skeleton rounded w-20" />
                    <div className="h-5 skeleton rounded w-20" />
                    <div className="h-5 skeleton rounded w-20" />
                </div>
                <div className="flex gap-2">
                    <div className="h-6 skeleton rounded-full w-16" />
                    <div className="h-6 skeleton rounded-full w-16" />
                    <div className="h-6 skeleton rounded-full w-16" />
                </div>
                <div className="h-12 skeleton rounded-lg" />
            </div>
        </div>
    )
}

export function VillaDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gallery skeleton */}
                <div className="space-y-4">
                    <div className="h-96 skeleton rounded-2xl" />
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 skeleton rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Details skeleton */}
                <div className="space-y-6">
                    <div className="h-10 skeleton rounded w-3/4" />
                    <div className="h-8 skeleton rounded w-1/4" />
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 skeleton rounded" />
                        ))}
                    </div>
                    <div className="h-64 skeleton rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
