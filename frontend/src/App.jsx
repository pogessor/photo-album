import { useState } from 'react'
import PhotoGallery from './components/PhotoGallery'
import SearchBar from './components/SearchBar'
import PhotoUploadForm from './components/PhotoUploadForm'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import PhotoDetailModal from './components/PhotoDetailModal'
import PhotoEditModal from './components/PhotoEditModal'
import { usePhotos } from './hooks/usePhotos'
import { useDebounce } from './hooks/useDebounce'
import { photoApi } from './api/photoApi'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { photos, loading, error, refresh } = usePhotos(debouncedSearchTerm)

  const [editTarget, setEditTarget] = useState(null)
  const [editing, setEditing] = useState(false)

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

  const handleEditSave = async (year, description) => {
    if (!editTarget) return
    setEditing(true)
    try {
      await photoApi.update(editTarget.id, year, description)
      setEditTarget(null)
      refresh()
    } catch {
      setEditTarget(null)
    } finally {
      setEditing(false)
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
          <PhotoGallery photos={photos} onDelete={setDeleteTarget} onSelect={setSelectedIndex} />
        )}
      </main>

      <DeleteConfirmModal
        photo={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />

      {editTarget && (
        <PhotoEditModal
          photo={editTarget}
          onSave={handleEditSave}
          onCancel={() => setEditTarget(null)}
          saving={editing}
        />
      )}

      <PhotoDetailModal
        photos={photos}
        currentIndex={selectedIndex}
        onNavigate={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
        onEdit={setEditTarget}
      />
    </div>
  )
}

export default App
