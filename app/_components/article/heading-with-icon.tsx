import { fragmentOn } from '@/.basehub'
import Image from 'next/image'

export const HeadingWithIconMark = ({
  icon,
  children,
}: HeadingWithIconFragment & { children?: React.ReactNode }) => {
  return (
    <>
      <Image
        className="absolute -left-10 top-1/2 h-6 w-6 -translate-y-1/2"
        alt={icon.alt ?? ''}
        width={icon.width}
        height={icon.height}
        src={icon.url}
      />
      {children}
    </>
  )
}

export const HeadingWithIconFragment = fragmentOn('HeadingWithIconComponent', {
  _id: true,
  icon: {
    alt: true,
    width: true,
    height: true,
    url: true,
  },
})

type HeadingWithIconFragment = fragmentOn.infer<typeof HeadingWithIconFragment>
