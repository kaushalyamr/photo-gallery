export default function SearchBar({ query, onSearch }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
      >
        <path
          d="M10 4a6 6 0 1 0 4.47 6.7l3.14 3.15a1 1 0 0 0 1.42-1.42l-3.15-3.14A6 6 0 0 0 10 4Zm-1 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
          fill="currentColor"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search by author…"
        aria-label="Search photos by author"
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )
}
