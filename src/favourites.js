const STORAGE_KEY = 'photo-gallery:favourites'

// localStorage can hold anything a previous visit wrote, so the read is guarded
// rather than trusted.
function readStoredFavourites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeStoredFavourites(favourites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  } catch {
    // A full or blocked storage must not break the gallery.
  }
}

function favouritesReducer(favourites, action) {
  switch (action.type) {
    case 'toggle':
      return favourites.includes(action.id)
        ? favourites.filter((id) => id !== action.id)
        : [...favourites, action.id]
    default:
      return favourites
  }
}

export { STORAGE_KEY, readStoredFavourites, writeStoredFavourites }
export default favouritesReducer
