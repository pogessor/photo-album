import { useEffect, useState } from 'react'
import { photoApi } from './api/photoApi'

function App() {
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    photoApi
      .getAll()
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Photo Album</h1>
      {error && <p style={{ color: 'red' }}>Hiba: {error}</p>}
      <p>Fotók száma: {photos.length}</p>
      <ul>
        {photos.map((photo) => (
          <li key={photo.id}>
            {photo.year} – {photo.description || '(nincs leírás)'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
