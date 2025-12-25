'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Upload,
    Trash2,
    Loader2,
    Search,
    Grid,
    List,
    Copy,
    Check,
    FolderOpen,
    Image as ImageIcon,
    File,
    X,
    Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { convertToWebP, formatFileSize, getSizeReduction } from '@/lib/imageUtils'
import AdminLayout from '@/components/admin/AdminLayout'
import { Media } from '@/types'
import { useToast } from '@/components/ui/Toast'

const folders = ['general', 'villas', 'experiences', 'blog', 'testimonials']

export default function MediaLibraryPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [media, setMedia] = useState<Media[]>([])
    const [selectedFolder, setSelectedFolder] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
        fetchMedia()
    }, [selectedFolder])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    async function fetchMedia() {
        setLoading(true)
        try {
            let query = supabase
                .from('media')
                .select('*')
                .order('created_at', { ascending: false })

            if (selectedFolder !== 'all') {
                query = query.eq('folder', selectedFolder)
            }

            const { data, error } = await query

            if (error) throw error
            setMedia(data || [])
        } catch (error) {
            console.error('Error fetching media:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const loadingId = toast.loading('Mengkonversi dan mengupload file...')

        try {
            let successCount = 0
            let totalSaved = 0

            for (const originalFile of Array.from(files)) {
                // Convert image to WebP format
                let file = originalFile
                const originalSize = originalFile.size

                if (originalFile.type.startsWith('image/') && originalFile.type !== 'image/svg+xml') {
                    file = await convertToWebP(originalFile, 0.85)
                    const saved = originalSize - file.size
                    if (saved > 0) totalSaved += saved
                }

                const fileExt = file.name.split('.').pop() || 'webp'
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `media/${selectedFolder === 'all' ? 'general' : selectedFolder}/${fileName}`

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath)

                // Save to media table
                const { error: dbError } = await supabase
                    .from('media')
                    .insert([{
                        filename: fileName,
                        original_name: originalFile.name,
                        url: urlData.publicUrl,
                        file_type: file.type.startsWith('image/') ? 'image' :
                            file.type.startsWith('video/') ? 'video' : 'document',
                        file_size: file.size,
                        folder: selectedFolder === 'all' ? 'general' : selectedFolder,
                    }])

                if (dbError) throw dbError
                successCount++
            }

            const savedMsg = totalSaved > 0 ? ` (Hemat ${formatFileSize(totalSaved)})` : ''
            toast.update(loadingId, {
                type: 'success',
                title: `${successCount} file berhasil diupload ke WebP${savedMsg}`
            })
            fetchMedia()
        } catch (error: any) {
            console.error('Error uploading:', error)
            toast.update(loadingId, { type: 'error', title: 'Gagal mengupload file', message: error.message })
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    async function handleDelete(item: Media) {
        if (!confirm('Yakin ingin menghapus file ini?')) return

        setDeleting(item.id)
        try {
            // Delete from storage
            const filePath = `media/${item.folder}/${item.filename}`
            await supabase.storage.from('media').remove([filePath])

            // Delete from database
            const { error } = await supabase
                .from('media')
                .delete()
                .eq('id', item.id)

            if (error) throw error

            toast.success('File berhasil dihapus')
            setSelectedMedia(null)
            fetchMedia()
        } catch (error: any) {
            console.error('Error deleting:', error)
            toast.error('Gagal menghapus file', error.message)
        } finally {
            setDeleting(null)
        }
    }

    function copyUrl(url: string, id: string) {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        toast.success('URL disalin ke clipboard')
        setTimeout(() => setCopiedId(null), 2000)
    }

    function formatFileSize(bytes: number | null) {
        if (!bytes) return '-'
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const filteredMedia = media.filter(item =>
        item.original_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-display text-gray-900">Media Library</h1>
                            <p className="text-gray-500 text-sm">Kelola gambar dan file (Auto WebP)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-900 transition-colors disabled:opacity-50"
                            >
                                {uploading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Upload size={18} />
                                )}
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar - Folders */}
                        <div className="w-48 flex-shrink-0">
                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Folders</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedFolder('all')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${selectedFolder === 'all'
                                        ? 'bg-olive-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <FolderOpen size={16} />
                                    <span>All Files</span>
                                </button>
                                {folders.map(folder => (
                                    <button
                                        key={folder}
                                        onClick={() => setSelectedFolder(folder)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm capitalize ${selectedFolder === folder
                                            ? 'bg-olive-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <FolderOpen size={16} />
                                        <span>{folder}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari file..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-olive-600 outline-none"
                                    />
                                </div>
                                <div className="flex border border-gray-200">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={40} className="animate-spin text-olive-600" />
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="text-center py-12 bg-white border border-gray-100">
                                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Tidak ada media</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-4 text-olive-600 hover:underline"
                                    >
                                        Upload file pertama
                                    </button>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredMedia.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedMedia(item)}
                                            className="relative aspect-square bg-gray-100 border border-gray-200 cursor-pointer group hover:border-olive-600 transition-colors overflow-hidden"
                                        >
                                            {item.file_type === 'image' ? (
                                                <Image
                                                    src={item.url}
                                                    alt={item.original_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <File size={32} className="text-gray-400" />
                                                </div>
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        copyUrl(item.url, item.id)
                                                    }}
                                                    className="p-2 bg-white text-gray-900 hover:bg-olive-600 hover:text-white"
                                                >
                                                    {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(item)
                                                    }}
                                                    disabled={deleting === item.id}
                                                    className="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                                                >
                                                    {deleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-100">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">File</th>
                                                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Folder</th>
                                                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Size</th>
                                                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMedia.map((item) => (
                                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 bg-gray-100">
                                                                {item.file_type === 'image' ? (
                                                                    <Image src={item.url} alt="" fill className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <File size={16} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-900 truncate max-w-xs">{item.original_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-500 capitalize">{item.folder}</td>
                                                    <td className="p-4 text-sm text-gray-500">{formatFileSize(item.file_size)}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => copyUrl(item.url, item.id)}
                                                                className="p-2 text-gray-400 hover:text-olive-600"
                                                            >
                                                                {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item)}
                                                                disabled={deleting === item.id}
                                                                className="p-2 text-gray-400 hover:text-red-600"
                                                            >
                                                                {deleting === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Media Detail Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-display text-xl">Media Details</h2>
                            <button onClick={() => setSelectedMedia(null)} className="p-2 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Preview */}
                            <div className="relative aspect-video bg-gray-100 mb-6">
                                {selectedMedia.file_type === 'image' ? (
                                    <Image
                                        src={selectedMedia.url}
                                        alt={selectedMedia.original_name}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <File size={48} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase mb-1">File Name</label>
                                    <p className="text-gray-900">{selectedMedia.original_name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase mb-1">URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={selectedMedia.url}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 text-sm"
                                        />
                                        <button
                                            onClick={() => copyUrl(selectedMedia.url, selectedMedia.id)}
                                            className="px-4 py-2 bg-olive-600 text-white hover:bg-olive-900"
                                        >
                                            {copiedId === selectedMedia.id ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase mb-1">Type</label>
                                        <p className="text-gray-900 capitalize">{selectedMedia.file_type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase mb-1">Size</label>
                                        <p className="text-gray-900">{formatFileSize(selectedMedia.file_size)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase mb-1">Folder</label>
                                        <p className="text-gray-900 capitalize">{selectedMedia.folder}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => handleDelete(selectedMedia)}
                                disabled={deleting === selectedMedia.id}
                                className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                            >
                                {deleting === selectedMedia.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
