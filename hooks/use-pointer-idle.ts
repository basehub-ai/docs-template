import * as React from 'react'

export const usePointerIdle = (idleTime = 3000) => {
  const [isIdle, setIsIdle] = React.useState(false)
  const idleTimerRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    function handlePointerMove() {
      setIsIdle(false)
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true)
      }, idleTime)
    }

    function handlePointerActive() {
      setIsIdle(false)
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true)
      }, idleTime)
    }

    function cleanup() {
      clearTimeout(idleTimerRef.current)
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mousedown', handlePointerActive)

    handlePointerMove()

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mousedown', handlePointerActive)
      cleanup()
    }
  }, [idleTime])

  return isIdle
}
