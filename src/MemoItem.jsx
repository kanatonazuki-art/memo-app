import { useState } from 'react'
import { MARKS } from './marks.js'
import { CATEGORIES } from './categories.js'

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function StarIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function MemoItem({ memo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(memo.text)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const categoryLabel = CATEGORIES.find(({ id }) => id === memo.category)?.label

  const startEdit = () => {
    setDraft(memo.text)
    setIsPickerOpen(false)
    setIsEditing(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onUpdate(memo.id, { text: trimmed })
    setIsEditing(false)
  }

  const selectMark = (mark) => {
    onUpdate(memo.id, { mark })
    setIsPickerOpen(false)
  }

  return (
    <li className="memo-item">
      {isEditing ? (
        <form className="memo-edit" onSubmit={handleSave}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsEditing(false)
            }}
            aria-label="メモを編集"
            autoFocus
          />
          <button type="submit" disabled={!draft.trim()}>
            保存
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            キャンセル
          </button>
        </form>
      ) : (
        <div className="memo-row">
          {memo.mark && <span className="memo-mark">{memo.mark}</span>}
          <div className="memo-body">
            <p className="memo-text">{memo.text}</p>
            <div className="memo-meta">
              {categoryLabel && (
                <span className={`memo-category is-${memo.category}`}>
                  {categoryLabel}
                </span>
              )}
              <time dateTime={memo.createdAt.toISOString()}>
                {dateFormatter.format(memo.createdAt)}
              </time>
            </div>
          </div>
          <div className="memo-actions">
            <button
              type="button"
              className={memo.mark ? 'mark-button is-marked' : 'mark-button'}
              onClick={() => setIsPickerOpen((open) => !open)}
              aria-label="マーク"
              aria-expanded={isPickerOpen}
              title="マーク"
            >
              <StarIcon filled={Boolean(memo.mark)} />
            </button>
            <button type="button" onClick={startEdit}>
              編集
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(memo.id)}
            >
              削除
            </button>
          </div>
        </div>
      )}
      {isPickerOpen && !isEditing && (
        <div className="mark-picker">
          <div className="mark-grid">
            {MARKS.map((mark) => (
              <button
                key={mark}
                type="button"
                className={mark === memo.mark ? 'is-selected' : undefined}
                onClick={() => selectMark(mark)}
                aria-label={`マーク ${mark}`}
                aria-pressed={mark === memo.mark}
              >
                {mark}
              </button>
            ))}
          </div>
          {memo.mark && (
            <button
              type="button"
              className="mark-clear"
              onClick={() => selectMark(null)}
            >
              マークを外す
            </button>
          )}
        </div>
      )}
    </li>
  )
}

export default MemoItem
