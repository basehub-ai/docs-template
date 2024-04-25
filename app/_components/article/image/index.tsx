'use client'

import * as React from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const ImageWithZoom = ({
  caption,
  src,
  alt,
  width,
  height,
}: {
  caption?: string | undefined
  src: string
  alt?: string | null
  width?: number
  height?: number
}) => {
  return (
    <Zoom>
      <picture>
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt ?? ''}
          sizes="(min-width: 1024px) 1024px, 100vw"
        />
      </picture>
      {caption && <p data-type="caption">{caption}</p>}
    </Zoom>
  )
}
