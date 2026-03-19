'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export interface CsvUploaderProps {
  onFileSelect: (file: File | null) => void
  maxSizeMB?: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CsvUploader({ onFileSelect, maxSizeMB = 5 }: CsvUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { errors: readonly { code: string }[] }[]) => {
      setError(null)

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0]
        if (firstError.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
        } else if (firstError.code === 'file-invalid-type') {
          setError('Only .csv files are accepted.')
        } else {
          setError('Invalid file. Please upload a .csv file.')
        }
        setSelectedFile(null)
        onFileSelect(null)
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [maxSizeMB, maxSizeBytes, onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: maxSizeBytes,
    multiple: false,
  })

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedFile(null)
    setError(null)
    onFileSelect(null)
  }

  // ── File selected state ──────────────────────────────────────────────────
  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <CsvIcon />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{selectedFile.name}</p>
          <p className="text-xs text-gray-400">{formatBytes(selectedFile.size)}</p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Remove file"
        >
          <XIcon />
        </button>
      </div>
    )
  }

  // ── Drop zone state ──────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />

        <UploadIcon active={isDragActive} hasError={!!error} />

        <div>
          <p className={`text-sm font-medium ${isDragActive ? 'text-indigo-700' : error ? 'text-red-700' : 'text-gray-700'}`}>
            {isDragActive
              ? 'Drop your CSV here'
              : 'Drag & drop your CSV here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            .csv files only — max {maxSizeMB}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function UploadIcon({ active, hasError }: { active: boolean; hasError: boolean }) {
  const color = active ? '#6366f1' : hasError ? '#ef4444' : '#9ca3af'
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function CsvIcon() {
  return (
    <svg className="h-8 w-8 shrink-0 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
