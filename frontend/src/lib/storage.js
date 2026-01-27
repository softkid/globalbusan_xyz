/**
 * Supabase Storage 유틸리티
 * 파일 업로드, 다운로드, 삭제 기능 제공
 */

import { supabase } from './supabase'

/**
 * Storage 버킷 이름
 */
export const STORAGE_BUCKETS = {
  PROJECTS: 'project-images',
  AVATARS: 'user-avatars',
  DOCUMENTS: 'documents',
  REPORTS: 'reports'
}

/**
 * 파일 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로 (예: 'projects/project-1/image.jpg')
 * @param {Object} options - 업로드 옵션
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const uploadFile = async (file, bucket, path, options = {}) => {
  try {
    const {
      cacheControl = '3600',
      contentType = file.type,
      upsert = false
    } = options

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl,
        contentType,
        upsert
      })

    if (error) {
      console.error('파일 업로드 실패:', error)
      return { data: null, error }
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      data: {
        ...data,
        publicUrl: urlData.publicUrl
      },
      error: null
    }
  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return { data: null, error }
  }
}

/**
 * 파일 다운로드
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @returns {Promise<{data: Blob, error: Error}>}
 */
export const downloadFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)

    if (error) {
      console.error('파일 다운로드 실패:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('파일 다운로드 오류:', error)
    return { data: null, error }
  }
}

/**
 * 파일 삭제
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const deleteFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('파일 삭제 실패:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('파일 삭제 오류:', error)
    return { data: null, error }
  }
}

/**
 * 파일 목록 가져오기
 * @param {string} bucket - 버킷 이름
 * @param {string} folder - 폴더 경로 (선택사항)
 * @param {Object} options - 옵션
 * @returns {Promise<{data: Array, error: Error}>}
 */
export const listFiles = async (bucket, folder = '', options = {}) => {
  try {
    const {
      limit = 100,
      offset = 0,
      sortBy = { column: 'name', order: 'asc' }
    } = options

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        offset,
        sortBy
      })

    if (error) {
      console.error('파일 목록 가져오기 실패:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('파일 목록 가져오기 오류:', error)
    return { data: null, error }
  }
}

/**
 * 공개 URL 가져오기
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @returns {string} 공개 URL
 */
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * 서명된 URL 가져오기 (비공개 파일용)
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @param {number} expiresIn - 만료 시간 (초, 기본값: 3600)
 * @returns {Promise<{data: {signedUrl: string}, error: Error}>}
 */
export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('서명된 URL 생성 실패:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('서명된 URL 생성 오류:', error)
    return { data: null, error }
  }
}

/**
 * 이미지 리사이즈 및 최적화 (클라이언트 측)
 * @param {File} file - 원본 파일
 * @param {Object} options - 리사이즈 옵션
 * @returns {Promise<File>}
 */
export const resizeImage = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8
    } = options

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 비율 유지하면서 리사이즈
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width
            width = maxWidth
          } else {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          },
          file.type,
          quality
        )
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 파일 크기 검증
 * @param {File} file - 검증할 파일
 * @param {number} maxSize - 최대 크기 (바이트)
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize
}

/**
 * 파일 타입 검증
 * @param {File} file - 검증할 파일
 * @param {Array<string>} allowedTypes - 허용된 MIME 타입
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.type)
}

/**
 * 프로젝트 이미지 업로드
 * @param {File} file - 이미지 파일
 * @param {number} projectId - 프로젝트 ID
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const uploadProjectImage = async (file, projectId) => {
  // 파일 검증
  if (!validateFileSize(file, 10 * 1024 * 1024)) {
    return {
      data: null,
      error: new Error('파일 크기는 10MB를 초과할 수 없습니다.')
    }
  }

  if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) {
    return {
      data: null,
      error: new Error('지원되지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 지원)')
    }
  }

  // 이미지 리사이즈
  let processedFile = file
  try {
    processedFile = await resizeImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85
    })
  } catch (error) {
    console.warn('이미지 리사이즈 실패, 원본 파일 사용:', error)
  }

  // 파일 경로 생성
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const fileName = `project-${projectId}-${timestamp}.${extension}`
  const path = `projects/${projectId}/${fileName}`

  // 업로드
  return await uploadFile(processedFile, STORAGE_BUCKETS.PROJECTS, path, {
    contentType: processedFile.type,
    cacheControl: '3600'
  })
}

/**
 * 사용자 아바타 업로드
 * @param {File} file - 이미지 파일
 * @param {string} userId - 사용자 ID
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const uploadUserAvatar = async (file, userId) => {
  // 파일 검증
  if (!validateFileSize(file, 2 * 1024 * 1024)) {
    return {
      data: null,
      error: new Error('파일 크기는 2MB를 초과할 수 없습니다.')
    }
  }

  if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/webp'])) {
    return {
      data: null,
      error: new Error('지원되지 않는 파일 형식입니다. (JPEG, PNG, WebP만 지원)')
    }
  }

  // 이미지 리사이즈 (아바타는 작은 크기)
  let processedFile = file
  try {
    processedFile = await resizeImage(file, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.9
    })
  } catch (error) {
    console.warn('이미지 리사이즈 실패, 원본 파일 사용:', error)
  }

  // 파일 경로 생성
  const extension = file.name.split('.').pop()
  const fileName = `avatar-${userId}.${extension}`
  const path = `avatars/${userId}/${fileName}`

  // 기존 아바타 삭제 (있는 경우)
  const existingFiles = await listFiles(STORAGE_BUCKETS.AVATARS, `avatars/${userId}`)
  if (existingFiles.data && existingFiles.data.length > 0) {
    for (const existingFile of existingFiles.data) {
      await deleteFile(STORAGE_BUCKETS.AVATARS, `avatars/${userId}/${existingFile.name}`)
    }
  }

  // 업로드
  return await uploadFile(processedFile, STORAGE_BUCKETS.AVATARS, path, {
    contentType: processedFile.type,
    cacheControl: '3600',
    upsert: true
  })
}

/**
 * 문서 업로드
 * @param {File} file - 문서 파일
 * @param {string} category - 문서 카테고리
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const uploadDocument = async (file, category = 'general') => {
  // 파일 검증
  if (!validateFileSize(file, 20 * 1024 * 1024)) {
    return {
      data: null,
      error: new Error('파일 크기는 20MB를 초과할 수 없습니다.')
    }
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (!validateFileType(file, allowedTypes)) {
    return {
      data: null,
      error: new Error('지원되지 않는 파일 형식입니다. (PDF, DOC, DOCX, XLS, XLSX만 지원)')
    }
  }

  // 파일 경로 생성
  const timestamp = Date.now()
  const fileName = `${category}-${timestamp}-${file.name}`
  const path = `${category}/${fileName}`

  // 업로드
  return await uploadFile(file, STORAGE_BUCKETS.DOCUMENTS, path, {
    contentType: file.type,
    cacheControl: '3600'
  })
}

/**
 * Storage 서비스 객체
 */
export const storageService = {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  getPublicUrl,
  getSignedUrl,
  resizeImage,
  validateFileSize,
  validateFileType,
  uploadProjectImage,
  uploadUserAvatar,
  uploadDocument
}

