'use client'
import * as React from 'react'
import { IFrameFragment } from './fragment'

export const IFrameWithFadeIn = (props: IFrameFragment) => {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <iframe
      src={props.src}
      width="100%"
      style={{
        border: 'none',
        width: '100%',
        aspectRatio: '16 / 9',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
      onLoad={() => {
        setLoaded(true)
      }}
    />
  )
}
