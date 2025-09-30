'use client'
import { searchNeue } from './actions'

export const InputNeue = () => {
  return (
    <input
      type="text"
      onChange={(e) => {
        const now = performance.now()
        searchNeue(e.target.value).then((res) => {
          console.log(res)
          console.log('Search time:', performance.now() - now, 'ms')
        })
      }}
    />
  )
}
