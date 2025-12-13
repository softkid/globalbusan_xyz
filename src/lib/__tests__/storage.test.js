import { 
  uploadFile, 
  downloadFile, 
  deleteFile, 
  listFiles, 
  getPublicUrl,
  getSignedUrl,
  validateFileSize,
  validateFileType,
  uploadProjectImage,
  uploadUserAvatar,
  storageService
} from '../storage'
import { supabase } from '../supabase'

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        list: jest.fn(),
        getPublicUrl: jest.fn(),
        createSignedUrl: jest.fn()
      }))
    }
  }
}))

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateFileSize', () => {
    it('should validate file size correctly', () => {
      const smallFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(smallFile, 'size', { value: 1024 }) // 1KB

      const largeFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }) // 10MB

      expect(validateFileSize(smallFile, 5 * 1024 * 1024)).toBe(true)
      expect(validateFileSize(largeFile, 5 * 1024 * 1024)).toBe(false)
    })
  })

  describe('validateFileType', () => {
    it('should validate file type correctly', () => {
      const imageFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const pdfFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      expect(validateFileType(imageFile, ['image/jpeg', 'image/png'])).toBe(true)
      expect(validateFileType(pdfFile, ['image/jpeg', 'image/png'])).toBe(false)
      expect(validateFileType(pdfFile, ['application/pdf'])).toBe(true)
    })
  })

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test/path.jpg' },
        error: null
      })
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' }
      })

      supabase.storage.from().upload = mockUpload
      supabase.storage.from().getPublicUrl = mockGetPublicUrl

      const result = await uploadFile(file, 'test-bucket', 'test/path.jpg')

      expect(mockUpload).toHaveBeenCalledWith('test/path.jpg', file, expect.any(Object))
      expect(result.data).toBeDefined()
      expect(result.data.publicUrl).toBe('https://example.com/test.jpg')
    })

    it('should handle upload error', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' }
      })

      supabase.storage.from().upload = mockUpload

      const result = await uploadFile(file, 'test-bucket', 'test/path.jpg')

      expect(result.error).toBeDefined()
      expect(result.data).toBeNull()
    })
  })

  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const mockBlob = new Blob(['content'])
      const mockDownload = jest.fn().mockResolvedValue({
        data: mockBlob,
        error: null
      })

      supabase.storage.from().download = mockDownload

      const result = await downloadFile('test-bucket', 'test/path.jpg')

      expect(mockDownload).toHaveBeenCalledWith('test/path.jpg')
      expect(result.data).toBe(mockBlob)
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const mockRemove = jest.fn().mockResolvedValue({
        data: [{ name: 'test.jpg' }],
        error: null
      })

      supabase.storage.from().remove = mockRemove

      const result = await deleteFile('test-bucket', 'test/path.jpg')

      expect(mockRemove).toHaveBeenCalledWith(['test/path.jpg'])
      expect(result.error).toBeNull()
    })
  })

  describe('listFiles', () => {
    it('should list files successfully', async () => {
      const mockList = jest.fn().mockResolvedValue({
        data: [{ name: 'file1.jpg' }, { name: 'file2.jpg' }],
        error: null
      })

      supabase.storage.from().list = mockList

      const result = await listFiles('test-bucket', 'test/folder')

      expect(mockList).toHaveBeenCalledWith('test/folder', expect.any(Object))
      expect(result.data).toHaveLength(2)
    })
  })

  describe('getPublicUrl', () => {
    it('should return public URL', () => {
      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' }
      })

      supabase.storage.from().getPublicUrl = mockGetPublicUrl

      const url = getPublicUrl('test-bucket', 'test/path.jpg')

      expect(mockGetPublicUrl).toHaveBeenCalledWith('test/path.jpg')
      expect(url).toBe('https://example.com/test.jpg')
    })
  })

  describe('getSignedUrl', () => {
    it('should get signed URL successfully', async () => {
      const mockCreateSignedUrl = jest.fn().mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      })

      supabase.storage.from().createSignedUrl = mockCreateSignedUrl

      const result = await getSignedUrl('test-bucket', 'test/path.jpg', 3600)

      expect(mockCreateSignedUrl).toHaveBeenCalledWith('test/path.jpg', 3600)
      expect(result.data.signedUrl).toBe('https://example.com/signed-url')
    })
  })

  describe('uploadProjectImage', () => {
    it('should validate and upload project image', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'projects/1/test.jpg', publicUrl: 'https://example.com/test.jpg' },
        error: null
      })

      supabase.storage.from().upload = mockUpload
      supabase.storage.from().getPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' }
      })

      // Mock resizeImage (simplified)
      jest.spyOn(require('../storage'), 'resizeImage').mockResolvedValue(file)

      const result = await uploadProjectImage(file, 1)

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should reject file that is too large', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }) // 15MB

      const result = await uploadProjectImage(file, 1)

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('10MB')
    })

    it('should reject invalid file type', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = await uploadProjectImage(file, 1)

      expect(result.error).toBeDefined()
      expect(result.error.message).toContain('지원되지 않는')
    })
  })

  describe('storageService', () => {
    it('should export all service functions', () => {
      expect(storageService.uploadFile).toBeDefined()
      expect(storageService.downloadFile).toBeDefined()
      expect(storageService.deleteFile).toBeDefined()
      expect(storageService.listFiles).toBeDefined()
      expect(storageService.getPublicUrl).toBeDefined()
      expect(storageService.getSignedUrl).toBeDefined()
      expect(storageService.validateFileSize).toBeDefined()
      expect(storageService.validateFileType).toBeDefined()
      expect(storageService.uploadProjectImage).toBeDefined()
      expect(storageService.uploadUserAvatar).toBeDefined()
    })
  })
})

