'use client'
import * as React from 'react'
import { fragmentOn } from 'basehub'

export const IFrameComponent = (props: IFrameFragment) => {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <picture
      style={{
        maxWidth: '100%',
        width: '100%',
      }}
    >
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
    </picture>
  )
}

export const IFrameFragment = fragmentOn('IFrameComponent', {
  _id: true,
  src: true,
})

type IFrameFragment = fragmentOn.infer<typeof IFrameFragment>
