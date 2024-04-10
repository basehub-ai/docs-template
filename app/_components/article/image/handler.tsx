import * as React from 'react'
import { ImageWithZoom } from './index'

export const Image = ({
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
    <ImageWithZoom
      caption={caption}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  )
}
