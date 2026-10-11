import { photoApi } from '../api/photoApi'

function PhotoCard({ photo, onDelete }) {
  return (
    <div className="photo-card">
      <button
        type="button"
        className="photo-card-delete"
        onClick={() => onDelete(photo)}
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
