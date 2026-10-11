import { photoApi } from '../api/photoApi'

function PhotoDetailModal({ photo, onClose }) {
  if (!photo) return null

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal photo-detail" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="photo-detail-close" onClick={onClose} aria-label="Bezárás">
          ×
        </button>

        <div className="photo-detail-image-wrapper">
          <img
            src={photoApi.getImageUrl(photo.id)}
            alt={photo.description || 'Fotó'}
            className="photo-detail-image"
          />
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
