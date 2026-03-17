import { createContext, useContext } from 'react'

export const WasteRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null)

export function useWasteRef() {
  return useContext(WasteRefContext)
}
