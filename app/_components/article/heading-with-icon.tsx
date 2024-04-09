import { fragmentOn } from '@/.basehub'
import Image from 'next/image'

export const HeadingWithIconComponent = ({
  _title,
  icon,
}: HeadingWithIconFragment) => {
  return (
    <h2>
      {_title}
      <Image
        className="inline ml-2"
        alt={icon.alt ?? ''}
        width={icon.width}
        height={icon.height}
        src={icon.url}
      />
    </h2>
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
