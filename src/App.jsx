import { useCallback, useEffect, useReducer, useState } from 'react'
import Gallery from './components/Gallery'
import SearchBar from './components/SearchBar'
import favouritesReducer, { readStoredFavourites, writeStoredFavourites } from './favourites'

function App() {
  const [query, setQuery] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, readStoredFavourites)

  const handleSearch = useCallback((value) => setQuery(value), [])
  const toggleFavourite = useCallback((id) => dispatch({ type: 'toggle', id }), [])

  useEffect(() => writeStoredFavourites(favourites), [favourites])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Photo Gallery</h1>
            <p className="text-sm text-slate-500">
              {favourites.length > 0
                ? `${favourites.length} favourite${favourites.length > 1 ? 's' : ''} saved on this device`
                : 'Thirty photos from Picsum. Tap the heart to keep one.'}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <SearchBar query={query} onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Gallery query={query} favourites={favourites} onToggleFavourite={toggleFavourite} />
      </main>
    </div>
  )
}

export default App
