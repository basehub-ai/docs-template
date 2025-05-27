export const Video = ({
  src,
  caption,
  width,
  height,
  ...rest
}: {
  src: string
  caption?: string | undefined
  width?: number
  height?: number
}) => (
  <>
    <picture
      style={{ aspectRatio: width && height ? width / height : undefined }}
    >
      <video
        src={src}
        autoPlay
        playsInline
        muted
        loop
        controls
        {...rest}
        width={width}
        height={height}
        style={{ objectFit: 'cover' }}
      />
    </picture>
    {caption && <figcaption>{caption}</figcaption>}
  </>
)
