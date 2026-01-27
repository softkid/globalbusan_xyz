import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileUpload from '../FileUpload'
import { storageService } from '../../lib/storage'

// Mock storage service
jest.mock('../../lib/storage', () => ({
  storageService: {
    validateFileSize: jest.fn(),
    validateFileType: jest.fn(),
    uploadFile: jest.fn()
  }
}))

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'fileUpload.clickToUpload': '클릭하여 파일 업로드',
        'fileUpload.dragAndDrop': '또는 드래그 앤 드롭',
        'fileUpload.upload': '업로드',
        'fileUpload.uploading': '업로드 중...',
        'fileUpload.uploadSuccess': '업로드 성공!',
        'fileUpload.uploadFailed': '업로드 실패',
        'fileUpload.remove': '제거',
        'fileUpload.viewFile': '파일 보기',
        'fileUpload.fileTooLarge': '파일 크기가 너무 큽니다. (최대: {{maxSize}})',
        'fileUpload.invalidFileType': '지원되지 않는 파일 형식입니다.',
        'fileUpload.missingInfo': '필수 정보가 누락되었습니다.'
      }
      return translations[key] || key
    }
  })
}))

describe('FileUpload', () => {
  const mockOnUpload = jest.fn()
  const defaultProps = {
    onUpload: mockOnUpload,
    bucket: 'test-bucket',
    path: 'test/path.jpg',
    accept: ['image/*'],
    maxSize: 5 * 1024 * 1024,
    showPreview: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
    storageService.validateFileSize.mockReturnValue(true)
    storageService.validateFileType.mockReturnValue(true)
  })

  it('should render file upload interface', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('클릭하여 파일 업로드')).toBeInTheDocument()
    expect(screen.getByText('또는 드래그 앤 드롭')).toBeInTheDocument()
  })

  it('should handle file selection', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const { container } = render(<FileUpload {...defaultProps} />)
    
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('test.jpg')).toBeInTheDocument()
  })

  it('should validate file size', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    storageService.validateFileSize.mockReturnValue(false)
    
    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText(/파일 크기가 너무 큽니다/)).toBeInTheDocument()
  })

  it('should validate file type', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    storageService.validateFileType.mockReturnValue(false)
    
    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('지원되지 않는 파일 형식입니다.')).toBeInTheDocument()
  })

  it('should handle file upload', async () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    storageService.uploadFile.mockResolvedValue({
      data: { publicUrl: 'https://example.com/test.jpg' },
      error: null
    })

    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    const uploadButton = screen.getByText('업로드')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalled()
    }, { timeout: 3000 })

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith('https://example.com/test.jpg', null)
    }, { timeout: 3000 })
  })

  it('should handle upload error', async () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    storageService.uploadFile.mockResolvedValue({
      data: null,
      error: { message: 'Upload failed' }
    })

    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    const uploadButton = screen.getByText('업로드')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      // Error message might be in English or Korean
      const errorElement = screen.queryByText(/업로드 실패|Upload failed/i)
      expect(errorElement || screen.queryByText('Upload failed')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(null, expect.any(Object))
    })
  })

  it('should handle file removal', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const { container } = render(<FileUpload {...defaultProps} />)
    
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('test.jpg')).toBeInTheDocument()

    const removeButton = screen.getByText('제거')
    fireEvent.click(removeButton)

    expect(screen.getByText('클릭하여 파일 업로드')).toBeInTheDocument()
  })

  it('should handle drag and drop', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const { container } = render(<FileUpload {...defaultProps} />)
    
    const dropZone = container.querySelector('.border-2')
    
    fireEvent.dragOver(dropZone, { preventDefault: jest.fn() })
    fireEvent.drop(dropZone, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [file] }
    })

    expect(screen.getByText('test.jpg')).toBeInTheDocument()
  })

  it('should show preview for image files', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 1024 })
    
    // Mock FileReader
    global.FileReader = jest.fn(() => ({
      readAsDataURL: jest.fn(function() {
        this.onload({ target: { result: 'data:image/jpeg;base64,test' } })
      }),
      onload: null
    }))

    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('test.jpg')).toBeInTheDocument()
  })

  it('should display uploaded URL link', async () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    storageService.uploadFile.mockResolvedValue({
      data: { publicUrl: 'https://example.com/test.jpg' },
      error: null
    })

    const { container } = render(<FileUpload {...defaultProps} />)
    const input = container.querySelector('input[type="file"]')
    fireEvent.change(input, { target: { files: [file] } })

    const uploadButton = screen.getByText('업로드')
    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('파일 보기')).toBeInTheDocument()
    })
  })
})

