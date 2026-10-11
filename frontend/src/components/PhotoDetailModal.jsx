import { useEffect } from 'react'
import { photoApi } from '../api/photoApi'

function PhotoDetailModal({ photos, currentIndex, onNavigate, onClose }) {
  useEffect(() => {
    if (currentIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + photos.length) % photos.length)
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % photos.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, photos.length, onNavigate, onClose])

  if (currentIndex === null || !photos[currentIndex]) return null

  const photo = photos[currentIndex]
  const hasMultiple = photos.length > 1

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handlePrev = () => onNavigate((currentIndex - 1 + photos.length) % photos.length)

  const handleNext = () => onNavigate((currentIndex + 1) % photos.length)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal photo-detail" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="photo-detail-close" onClick={onClose} aria-label="Bezárás">
          ×
        </button>

        {hasMultiple && (
          <div className="photo-detail-counter">
            {currentIndex + 1} / {photos.length}
          </div>
        )}

        <div className="photo-detail-image-wrapper">
          <img
            src={photoApi.getImageUrl(photo.id)}
            alt={photo.description || 'Fotó'}
            className="photo-detail-image"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                className="photo-detail-nav-button photo-detail-nav-prev"
                onClick={handlePrev}
                aria-label="Előző fotó"
              >
                ‹
              </button>
              <button
                type="button"
                className="photo-detail-nav-button photo-detail-nav-next"
                onClick={handleNext}
                aria-label="Következő fotó"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="photo-detail-info">
          <h2 className="photo-detail-year">{photo.year}</h2>
          <p className="photo-detail-description">{photo.description || '(nincs leírás)'}</p>
          {photo.originalFilename && (
            <p className="photo-detail-filename">Eredeti fájlnév: {photo.originalFilename}</p>
          )}
          {photo.uploadedAt && (
            <p className="photo-detail-date">Feltöltve: {formatDate(photo.uploadedAt)}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhotoDetailModal
