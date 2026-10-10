import PhotoCard from './PhotoCard'

function PhotoGallery({ photos }) {
  if (photos.length === 0) {
    return <p className="gallery-empty">Nincs megjeleníthető fotó.</p>
  }

  return (
    <div className="photo-gallery">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}

export default PhotoGallery
