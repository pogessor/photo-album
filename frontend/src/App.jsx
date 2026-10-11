import { useEffect, useState } from 'react'
import { photoApi } from './api/photoApi'
import PhotoGallery from './components/PhotoGallery'
import SearchBar from './components/SearchBar'
import PhotoUploadForm from './components/PhotoUploadForm'
import DeleteConfirmModal from './components/DeleteConfirmModal'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [state, setState] = useState({
    photos: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

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

  const handleDeleteRequest = (photo) => {
    setDeleteTarget(photo)
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await photoApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setState((prev) => ({ ...prev, error: 'Törlés sikertelen: ' + err.message }))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
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
        {!state.loading && !state.error && (
          <PhotoGallery photos={state.photos} onDelete={handleDeleteRequest} />
        )}
      </main>

      <DeleteConfirmModal
        photo={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        deleting={deleting}
      />
    </div>
  )
}

export default App
