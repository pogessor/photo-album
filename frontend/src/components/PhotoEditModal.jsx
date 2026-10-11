import { useState } from 'react'

function PhotoEditModal({ photo, onSave, onCancel, saving }) {
  const [year, setYear] = useState(photo.year)
  const [description, setDescription] = useState(photo.description || '')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const yearNumber = parseInt(year, 10)
    if (!yearNumber || yearNumber < 1000 || yearNumber > 9999) {
      setError('Az évszám négyjegyű szám kell legyen (1000-9999).')
      return
    }
    setError(null)
    onSave(yearNumber, description)
  }

  return (
    <div className="modal-backdrop modal-backdrop--elevated" onClick={onCancel}>
      <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Fotó szerkesztése</h3>
        <form onSubmit={handleSubmit}>
          <div className="upload-form-row">
            <label className="upload-form-label">Évszám</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1000"
              max="9999"
              disabled={saving}
            />
          </div>
          <div className="upload-form-row">
            <label className="upload-form-label">Leírás</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={saving}
            />
          </div>
          {error && <p className="upload-form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onCancel} disabled={saving}>
              Mégse
            </button>
            <button
              type="submit"
              className="modal-confirm modal-confirm--primary"
              disabled={saving}
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PhotoEditModal
