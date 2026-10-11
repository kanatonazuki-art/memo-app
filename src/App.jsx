import { useEffect, useState } from 'react'
import MemoItem from './MemoItem.jsx'
import { CATEGORIES } from './categories.js'

const FILTERS = [{ id: 'all', label: 'すべて' }, ...CATEGORIES]
const STORAGE_KEY = 'memo-app:memos'

const loadMemos = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(stored)) return []
    return stored.map((memo) => ({
      ...memo,
      createdAt: new Date(memo.createdAt),
    }))
  } catch {
    return []
  }
}

const saveMemos = (memos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  } catch {
    // 保存できない環境（容量超過・プライベートモードなど）でも動作は続ける
  }
}

function App() {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [filter, setFilter] = useState('all')
  const [memos, setMemos] = useState(loadMemos)

  useEffect(() => {
    saveMemos(memos)
  }, [memos])

  const visibleMemos =
    filter === 'all' ? memos : memos.filter((memo) => memo.category === filter)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setMemos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        category,
        createdAt: new Date(),
        mark: null,
      },
      ...prev,
    ])
    setText('')
  }

  const updateMemo = (id, patch) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, ...patch } : memo)),
    )
  }

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
  }

  return (
    <main className="app">
      <h1>メモアプリ</h1>
      <form className="memo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メモを入力"
          aria-label="メモ"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="カテゴリ"
        >
          {CATEGORIES.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>
      <div className="memo-filter" role="group" aria-label="カテゴリで絞り込み">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={id === filter ? 'is-active' : undefined}
            onClick={() => setFilter(id)}
            aria-pressed={id === filter}
          >
            {label}
          </button>
        ))}
      </div>
      {visibleMemos.length === 0 ? (
        <p className="memo-empty">
          {memos.length === 0
            ? 'メモはまだありません'
            : 'このカテゴリのメモはありません'}
        </p>
      ) : (
        <ul className="memo-list">
          {visibleMemos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onUpdate={updateMemo}
              onDelete={deleteMemo}
            />
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
