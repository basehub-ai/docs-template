export const Video = ({ src, ...rest }: { src: string }) => (
  <picture>
    <video src={src} autoPlay playsInline muted loop controls {...rest} />
  </picture>
)
