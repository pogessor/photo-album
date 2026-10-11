import { useState } from 'react'
import PhotoGallery from './components/PhotoGallery'
import SearchBar from './components/SearchBar'
import PhotoUploadForm from './components/PhotoUploadForm'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import PhotoDetailModal from './components/PhotoDetailModal'
import { usePhotos } from './hooks/usePhotos'
import { useDebounce } from './hooks/useDebounce'
import { photoApi } from './api/photoApi'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { photos, loading, error, refresh } = usePhotos(debouncedSearchTerm)

  const handleUploadSuccess = () => {
    setShowUploadForm(false)
    refresh()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await photoApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      refresh()
    } catch {
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
        {loading && <p className="app-loading">Betöltés...</p>}
        {error && <p className="app-error">Hiba: {error}</p>}
        {!loading && !error && (
          <PhotoGallery photos={photos} onDelete={setDeleteTarget} onSelect={setSelectedPhoto} />
        )}
      </main>

      <DeleteConfirmModal
        photo={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />

      <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  )
}

export default App
