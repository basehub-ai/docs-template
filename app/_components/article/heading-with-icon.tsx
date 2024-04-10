import { fragmentOn } from '@/.basehub'
import Image from 'next/image'

export const HeadingWithIconComponent = ({
  _title,
  icon,
}: HeadingWithIconFragment) => {
  return (
    <h3 className="relative">
      <Image
        className="absolute -left-12 top-1/2 h-8 w-8 -translate-y-1/2 "
        alt={icon.alt ?? ''}
        width={icon.width}
        height={icon.height}
        src={icon.url}
      />
      {_title}
    </h3>
  )
}

export const HeadingWithIconFragment = fragmentOn('HeadingWithIconComponent', {
  _id: true,
  _title: true,
  icon: {
    alt: true,
    width: true,
    height: true,
    url: true,
  },
})

type HeadingWithIconFragment = fragmentOn.infer<typeof HeadingWithIconFragment>
