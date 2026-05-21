import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  toggleFavorite: (variantId: string) => void
  isFavorite: (variantId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (variantId) => {
        const { favorites } = get()
        const isFav = favorites.includes(variantId)
        if (isFav) {
          set({ favorites: favorites.filter((id) => id !== variantId) })
        } else {
          set({ favorites: [...favorites, variantId] })
        }
      },
      isFavorite: (variantId) => get().favorites.includes(variantId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
