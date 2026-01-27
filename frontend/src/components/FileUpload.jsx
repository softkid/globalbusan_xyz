import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUpload, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa'
import { storageService } from '../lib/storage'

/**
 * 파일 업로드 컴포넌트
 * @param {Object} props
 * @param {Function} props.onUpload - 업로드 완료 콜백 (url, error)
 * @param {string} props.bucket - Storage 버킷 이름
 * @param {string} props.path - 파일 경로
 * @param {Array<string>} props.accept - 허용된 파일 타입
 * @param {number} props.maxSize - 최대 파일 크기 (바이트)
 * @param {boolean} props.showPreview - 미리보기 표시 여부
 * @param {string} props.label - 라벨 텍스트
 */
function FileUpload({
  onUpload,
  bucket,
  path,
  accept = ['image/*'],
  maxSize = 5 * 1024 * 1024, // 5MB
  showPreview = true,
  label,
  className = ''
}) {
  const { t } = useTranslation()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // 파일 크기 검증
    if (!storageService.validateFileSize(selectedFile, maxSize)) {
      setError(t('fileUpload.fileTooLarge', { maxSize: `${(maxSize / 1024 / 1024).toFixed(0)}MB` }))
      return
    }

    // 파일 타입 검증
    if (accept.length > 0 && !accept.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0]
        return selectedFile.type.startsWith(baseType + '/')
      }
      return selectedFile.type === type
    })) {
      setError(t('fileUpload.invalidFileType'))
      return
    }

    setFile(selectedFile)
    setError(null)

    // 미리보기 생성
    if (showPreview && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file || !bucket || !path) {
      setError(t('fileUpload.missingInfo'))
      return
    }

    setUploading(true)
    setError(null)

    try {
      const { data, error: uploadError } = await storageService.uploadFile(
        file,
        bucket,
        path
      )

      if (uploadError) {
        setError(uploadError.message || t('fileUpload.uploadFailed'))
        if (onUpload) {
          onUpload(null, uploadError)
        }
      } else {
        setUploadedUrl(data.publicUrl)
        if (onUpload) {
          onUpload(data.publicUrl, null)
        }
      }
    } catch (err) {
      const errorMessage = err.message || t('fileUpload.uploadFailed')
      setError(errorMessage)
      if (onUpload) {
        onUpload(null, err)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setUploadedUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const event = {
        target: {
          files: [droppedFile]
        }
      }
      handleFileSelect(event)
    }
  }

  return (
    <div className={`file-upload ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? 'border-red-300 bg-red-50'
            : uploadedUrl
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <FaUpload className="text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {t('fileUpload.clickToUpload')}
              </p>
              <p className="text-xs text-gray-500">
                {t('fileUpload.dragAndDrop')}
              </p>
            </label>
          </>
        ) : (
          <div className="space-y-4">
            {showPreview && preview && (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-48 rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-gray-700">{file.name}</p>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {uploadedUrl && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm flex items-center justify-center gap-2">
                <FaCheck />
                {t('fileUpload.uploadSuccess')}
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              {!uploadedUrl && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {t('fileUpload.uploading')}
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      {t('fileUpload.upload')}
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleRemove}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
              >
                <FaTimes />
                {t('fileUpload.remove')}
              </button>
            </div>
          </div>
        )}
      </div>

      {uploadedUrl && (
        <div className="mt-2">
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {t('fileUpload.viewFile')}
          </a>
        </div>
      )}
    </div>
  )
}

export default FileUpload

