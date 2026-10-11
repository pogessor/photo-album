import PhotoCard from './PhotoCard'

function PhotoGallery({ photos, onDelete, onSelect }) {
  if (photos.length === 0) {
    return <p className="gallery-empty">Nincs megjeleníthető fotó.</p>
  }

  return (
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onDelete={onDelete}
          onSelect={() => onSelect(index)}
        />
      ))}
    </div>
  )
}

export default PhotoGallery
