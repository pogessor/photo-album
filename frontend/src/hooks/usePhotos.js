import { useEffect, useState } from 'react'
import { photoApi } from '../api/photoApi'

export function usePhotos(searchTerm) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchPhotos = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = searchTerm ? await photoApi.search(searchTerm) : await photoApi.getAll()
        if (!cancelled) {
          setPhotos(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchPhotos()
    return () => {
      cancelled = true
    }
  }, [searchTerm, refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  return { photos, loading, error, refresh }
}
