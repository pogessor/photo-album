function DeleteConfirmModal({ photo, onConfirm, onCancel, deleting }) {
  if (!photo) return null

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Törlés megerősítése</h3>
        <p className="modal-message">
          Biztosan törölni szeretnéd ezt a fotót? Ez a művelet nem visszavonható.
        </p>
        <p className="modal-photo-info">
          {photo.year} – {photo.description || '(nincs leírás)'}
        </p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel} disabled={deleting}>
            Mégse
          </button>
          <button className="modal-confirm" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Törlés...' : 'Törlés'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
