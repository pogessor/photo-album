import { photoApi } from '../api/photoApi'

function PhotoCard({ photo, onDelete, onSelect }) {
  const handleCardClick = () => {
    onSelect()
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    onDelete(photo)
  }

  return (
    <div className="photo-card" onClick={handleCardClick}>
      <button
        type="button"
        className="photo-card-delete"
        onClick={handleDeleteClick}
        aria-label="Fotó törlése"
      >
        ×
      </button>
      <img
        src={photoApi.getImageUrl(photo.id)}
        alt={photo.description || 'Fotó'}
        className="photo-card-image"
      />
      <div className="photo-card-body">
        <h3 className="photo-card-year">{photo.year}</h3>
        <p className="photo-card-description">{photo.description || '(nincs leírás)'}</p>
      </div>
    </div>
  )
}

export default PhotoCard
