import { useEffect, useState } from 'react'
import { photoApi } from './api/photoApi'
import PhotoGallery from './components/PhotoGallery'
import SearchBar from './components/SearchBar'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [state, setState] = useState({
    photos: [],
    loading: true,
    error: null,
  })

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Adatlekérés
  useEffect(() => {
    let cancelled = false

    const fetchPhotos = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = debouncedSearchTerm
          ? await photoApi.search(debouncedSearchTerm)
          : await photoApi.getAll()

        if (!cancelled) {
          setState({ photos: data, loading: false, error: null })
        }
      } catch (err) {
        if (!cancelled) {
          setState({ photos: [], loading: false, error: err.message })
        }
      }
    }

    fetchPhotos()

    return () => {
      cancelled = true
    }
  }, [debouncedSearchTerm])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Photo Album</h1>
      </header>

      <main className="app-main">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Keresés év vagy leírás alapján..."
        />

        {state.loading && <p className="app-loading">Betöltés...</p>}
        {state.error && <p className="app-error">Hiba: {state.error}</p>}
        {!state.loading && !state.error && <PhotoGallery photos={state.photos} />}
      </main>
    </div>
  )
}

export default App
