/**
 * Custom hook for lazy loading elements
 */
import { useEffect, useRef, useState } from 'react'

/**
 * Hook to detect when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isIntersecting]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          setHasIntersected(true)
          // Unobserve after first intersection for performance
          observer.unobserve(element)
        } else {
          setIsIntersecting(false)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [options])

  return [elementRef, isIntersecting, hasIntersected]
}

/**
 * Hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} { ref, src: loadedSrc, isLoaded, hasError }
 */
export function useLazyImage(src, options = {}) {
  const [loadedSrc, setLoadedSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [ref, isIntersecting] = useIntersectionObserver(options)

  useEffect(() => {
    if (isIntersecting && src && !loadedSrc) {
      const img = new Image()
      img.onload = () => {
        setLoadedSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setHasError(true)
      }
      img.src = src
    }
  }, [isIntersecting, src, loadedSrc])

  return { ref, src: loadedSrc, isLoaded, hasError }
}

/**
 * Hook for lazy loading components
 * @param {Function} importFn - Dynamic import function
 * @returns {Object} { Component, isLoading, error }
 */
export function useLazyComponent(importFn) {
  const [Component, setComponent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    importFn()
      .then((module) => {
        setComponent(() => module.default)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err)
        setIsLoading(false)
      })
  }, [importFn])

  return { Component, isLoading, error }
}

