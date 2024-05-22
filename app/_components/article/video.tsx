export const Video = ({
  src,
  caption,
  ...rest
}: {
  src: string
  caption?: string | undefined
}) => (
  <>
    <picture>
      <video src={src} autoPlay playsInline muted loop controls {...rest} />
    </picture>
    {caption && <figcaption>{caption}</figcaption>}
  </>
)
