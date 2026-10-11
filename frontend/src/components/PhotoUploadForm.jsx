import { useEffect, useRef, useState } from 'react'
import { photoApi } from '../api/photoApi'

function PhotoUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [describing, setDescribing] = useState(false)
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setError(null)
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setYear('')
    setDescription('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDescribe = async () => {
    if (!file) {
      setError('Először válassz egy képet.')
      return
    }
    setDescribing(true)
    setError(null)
    try {
      const result = await photoApi.describe(file)
      setDescription(result.description)
    } catch (err) {
      setError('Nem sikerült a leírás generálása: ' + err.message)
    } finally {
      setDescribing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Először válassz egy képet.')
      return
    }
    const yearNumber = parseInt(year, 10)
    if (!yearNumber || yearNumber < 1000 || yearNumber > 9999) {
      setError('Az évszám négyjegyű szám kell legyen (1000-9999).')
      return
    }

    setUploading(true)
    setError(null)
    try {
      await photoApi.upload(file, yearNumber, description)
      resetForm()
      onUploadSuccess()
    } catch (err) {
      setError('Feltöltés sikertelen: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const isBusy = uploading || describing

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h2>Új fotó feltöltése</h2>

      <div className="upload-form-row">
        <label className="upload-form-label">Fotó</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isBusy}
        />
      </div>

      {preview && (
        <div className="upload-form-preview">
          <img src={preview} alt="Előnézet" />
        </div>
      )}

      <div className="upload-form-row">
        <label className="upload-form-label">Évszám</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="pl. 2023"
          min="1000"
          max="9999"
          disabled={isBusy}
        />
      </div>

      <div className="upload-form-row">
        <label className="upload-form-label">Leírás</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Írj leírást, vagy használd az AI-t..."
          rows={3}
          maxLength={1000}
          disabled={isBusy}
        />
        <button
          type="button"
          className="upload-form-ai-button"
          onClick={handleDescribe}
          disabled={isBusy || !file}
        >
          {describing ? 'AI dolgozik...' : '✨ Leírás AI-val'}
        </button>
      </div>

      {error && <p className="upload-form-error">{error}</p>}

      <div className="upload-form-actions">
        <button type="submit" className="upload-form-submit" disabled={isBusy || !file}>
          {uploading ? 'Feltöltés...' : 'Feltöltés'}
        </button>
        <button type="button" className="upload-form-reset" onClick={resetForm} disabled={isBusy}>
          Törlés
        </button>
      </div>
    </form>
  )
}

export default PhotoUploadForm
