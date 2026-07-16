import { useMemo } from 'react'

export function useGreedyColumns(entries, numCols) {
  const cols = useMemo(() => {
    const columns = Array.from({ length: numCols }, () => [])
    const heights = Array(numCols).fill(0)
    entries.forEach((entry, idx) => {
      const minCol = heights.indexOf(Math.min(...heights))
      columns[minCol].push({ entry, idx })
      heights[minCol] += entry.columnWeight ?? entry.aspectRatio ?? entry.poem?.split('\n').length ?? 1
    })
    return columns
  }, [entries, numCols])

  return { cols }
}
