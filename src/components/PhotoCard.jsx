function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M12 20.4 4.6 13.2a4.9 4.9 0 0 1 0-6.9 4.8 4.8 0 0 1 6.8 0l.6.6.6-.6a4.8 4.8 0 0 1 6.8 0 4.9 4.9 0 0 1 0 6.9Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <li className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        src={`https://picsum.photos/id/${photo.id}/600/400`}
        alt={`Photo by ${photo.author}`}
        loading="lazy"
        className="aspect-3/2 w-full bg-slate-100 object-cover"
      />
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="truncate font-medium text-slate-800">{photo.author}</p>
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          className={`shrink-0 rounded-full p-2 outline-none transition focus-visible:ring-2 focus-visible:ring-rose-200 ${
            isFavourite ? 'text-rose-500' : 'text-slate-300 hover:text-rose-300'
          }`}
        >
          <HeartIcon filled={isFavourite} />
        </button>
      </div>
    </li>
  )
}
