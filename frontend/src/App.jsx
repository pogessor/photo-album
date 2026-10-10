import { useEffect, useState } from 'react'
import { photoApi } from './api/photoApi'
import PhotoGallery from './components/PhotoGallery'

function App() {
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    photoApi
      .getAll()
      .then((data) => {
        setPhotos(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Photo Album</h1>
      </header>

      <main className="app-main">
        {loading && <p className="app-loading">Betöltés...</p>}
        {error && <p className="app-error">Hiba: {error}</p>}
        {!loading && !error && <PhotoGallery photos={photos} />}
      </main>
    </div>
  )
}

export default App
