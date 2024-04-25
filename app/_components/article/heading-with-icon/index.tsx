import { fragmentOn } from '@/.basehub'
import Image from 'next/image'

import s from './heading-with-icon.module.scss'

export const HeadingWithIconMark = ({
  icon,
  children,
}: HeadingWithIconFragment & { children?: React.ReactNode }) => {
  return (
    <>
      <Image
        className={s['heading-icon']}
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
