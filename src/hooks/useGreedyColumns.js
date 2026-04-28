import { useState, useMemo, useCallback } from 'react'

export function useGreedyColumns(entries, numCols) {
  const [weights, setWeights] = useState({})

  const registerWeight = useCallback((key, weight) => {
    setWeights(prev => {
      if (prev[key] !== undefined) return prev
      return { ...prev, [key]: weight }
    })
  }, [])

  const cols = useMemo(() => {
    const columns = Array.from({ length: numCols }, () => [])
    const heights = Array(numCols).fill(0)
    entries.forEach((entry, idx) => {
      const minCol = heights.indexOf(Math.min(...heights))
      columns[minCol].push({ entry, idx })
      heights[minCol] += weights[entry.title] ?? 1
    })
    return columns
  }, [entries, weights, numCols])

  return { cols, registerWeight }
}
