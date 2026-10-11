import { useEffect, useState } from 'react'
import { photoApi } from './api/photoApi'
import PhotoGallery from './components/PhotoGallery'
import SearchBar from './components/SearchBar'
import PhotoUploadForm from './components/PhotoUploadForm'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
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
  }, [debouncedSearchTerm, refreshKey])

  const handleUploadSuccess = () => {
    setShowUploadForm(false)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Photo Album</h1>
        <button className="app-header-button" onClick={() => setShowUploadForm((v) => !v)}>
          {showUploadForm ? 'Bezárás' : '+ Új fotó'}
        </button>
      </header>

      <main className="app-main">
        {showUploadForm && <PhotoUploadForm onUploadSuccess={handleUploadSuccess} />}

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
