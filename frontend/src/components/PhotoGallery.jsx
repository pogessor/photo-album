import PhotoCard from './PhotoCard'

function PhotoGallery({ photos, onDelete }) {
  if (photos.length === 0) {
    return <p className="gallery-empty">Nincs megjeleníthető fotó.</p>
  }

  return (
    <div className="photo-gallery">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default PhotoGallery
