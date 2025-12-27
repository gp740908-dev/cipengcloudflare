'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react'
import Image from 'next/image'
import { uploadToImageKit, uploadMultipleToImageKit } from '@/lib/imagekit-upload'

interface ImageUploaderProps {
    images: string[]
    onImagesChange: (images: string[]) => void
    folder?: string
    maxImages?: number
    disabled?: boolean
}

export default function ImageUploader({
    images,
    onImagesChange,
    folder = 'villas',
    maxImages = 10,
    disabled = false,
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return
        if (disabled) return

        setError(null)
        setIsUploading(true)
        setUploadProgress(0)

        try {
            const fileArray = Array.from(files)
            const remainingSlots = maxImages - images.length
            const filesToUpload = fileArray.slice(0, remainingSlots)

            if (filesToUpload.length === 0) {
                setError(`Maximum ${maxImages} images allowed`)
                return
            }

            const uploadedUrls: string[] = []

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i]

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    continue
                }

                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    setError('File size must be less than 10MB')
                    continue
                }

                const result = await uploadToImageKit(file, { folder })
                uploadedUrls.push(result.url)

                setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100))
            }

            if (uploadedUrls.length > 0) {
                onImagesChange([...images, ...uploadedUrls])
            }
        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload images')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }, [images, maxImages, folder, disabled, onImagesChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        handleFiles(e.dataTransfer.files)
    }, [handleFiles])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
    }, [])

    const removeImage = useCallback((index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
    }, [images, onImagesChange])

    const moveImage = useCallback((fromIndex: number, toIndex: number) => {
        const newImages = [...images]
        const [removed] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, removed)
        onImagesChange(newImages)
    }, [images, onImagesChange])

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onClick={() => !disabled && !isUploading && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                    ${dragActive ? 'border-olive-500 bg-olive-50' : 'border-gray-300 hover:border-olive-400'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isUploading ? 'pointer-events-none' : ''}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled || isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-olive-600 animate-spin" />
                        <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-olive-600 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, WebP up to 10MB ({images.length}/{maxImages})
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={url}
                            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                        >
                            <Image
                                src={url}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* First image badge */}
                            {index === 0 && (
                                <span className="absolute top-2 left-2 px-2 py-1 bg-olive-600 text-white text-xs rounded">
                                    Main
                                </span>
                            )}

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, 0)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="Set as main image"
                                    >
                                        <Check className="w-4 h-4 text-olive-600" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
