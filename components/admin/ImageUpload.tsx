'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onRemove?: () => void
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError(null)

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only images allowed.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5MB.')
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-screenshot', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Screenshot preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              uploading
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP, GIF (max 5MB)</p>
              </>
            )}
          </label>
        </div>
      )}

      {/* Manual URL input as fallback */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL directly"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
