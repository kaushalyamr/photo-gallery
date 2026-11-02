import { useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import PhotoCard from './PhotoCard'

export default function Gallery({ query, favourites, onToggleFavourite }) {
  const { photos, loading, error } = useFetchPhotos()

  const filteredPhotos = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return photos
    return photos.filter((photo) => photo.author.toLowerCase().includes(term))
  }, [photos, query])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-slate-500">
        <span
          role="status"
          aria-label="Loading photos"
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-500"
        />
        <p className="text-sm">Loading photos…</p>
      </div>
    )
  }

  if (error) {
    return (
      <p
        role="alert"
        className="my-10 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
      >
        {error}
      </p>
    )
  }

  if (filteredPhotos.length === 0) {
    return (
      <p className="py-24 text-center text-slate-500">
        No author matches “{query.trim()}”.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {filteredPhotos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavourite={favourites.includes(photo.id)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </ul>
  )
}
