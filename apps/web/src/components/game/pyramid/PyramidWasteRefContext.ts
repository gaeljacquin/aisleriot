import { createContext, useContext } from 'react'

export const PyramidWasteRefContext =
  createContext<React.RefObject<HTMLDivElement | null> | null>(null)

export function usePyramidWasteRef() {
  return useContext(PyramidWasteRefContext)
}
