import { useEffect, useState } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

/** Loads the gallery feed once and keeps the three states the UI needs apart. */
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Picsum replied with ${response.status}. Please try again later.`)
        }
        setPhotos(await response.json())
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return
        setError(fetchError.message || 'Could not load the photos.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchPhotos()
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
