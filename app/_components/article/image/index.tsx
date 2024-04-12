'use client'

import * as React from 'react'
import NextImage from 'next/image'
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
        <NextImage
          src={src}
          width={width}
          alt={alt ?? ''}
          height={height}
        />
      </picture>
      {caption && <p data-type='caption'>{caption}</p>}
    </Zoom>
  )
}
