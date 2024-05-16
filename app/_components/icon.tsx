/* eslint-disable @next/next/no-img-element */
import { pascalCase } from 'change-case'
import * as RadixIcons from '@radix-ui/react-icons'

type StandardProps = Partial<{
  width: string
  height: string
  className: string
  alt: string
}>

const iconRecord: Record<
  string,
  | {
      type: 'radix-icon'
      value: string
    }
  | {
      type: 'lucide-icon'
      value: string
    }
  | {
      type: 'inline'
      value: (_props: StandardProps) => JSX.Element | Promise<JSX.Element>
    }
  | {
      type: 'url'
      value: string
    }
  | {
      type: 'alias'
      value: string
    }
> = {
  next: {
    type: 'inline',
    value: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 180 180"
        width="18"
        {...props}
      >
        <mask
          height="180"
          id=":r8:mask0_408_134"
          maskUnits="userSpaceOnUse"
          width="180"
          x="0"
          y="0"
          style={{ maskType: 'alpha' }}
        >
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#:r8:mask0_408_134)">
          <circle cx="90" cy="90" data-circle="true" fill="black" r="90" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#:r8:paint0_linear_408_134)"
          />
          <rect
            fill="url(#:r8:paint1_linear_408_134)"
            height="72"
            width="12"
            x="115"
            y="54"
          />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id=":r8:paint0_linear_408_134"
            x1="109"
            x2="144.5"
            y1="116.5"
            y2="160.5"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id=":r8:paint1_linear_408_134"
            x1="121"
            x2="120.799"
            y1="54"
            y2="106.875"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  nextjs: {
    type: 'alias',
    value: 'next',
  },
}

export async function Icon({
  name,
  ...props
}: {
  name: string
} & StandardProps): Promise<JSX.Element> {
  const icon = iconRecord[name]
  if (!icon) return <></>

  switch (icon?.type) {
    case 'inline':
      return icon.value(props)
    case 'alias':
      return <Icon name={icon.value} {...props} />
    case 'radix-icon': {
      const pascal = pascalCase(name)
      // @ts-ignore
      const Comp = RadixIcons[pascal]

      console.log('pascal', pascal)
      return <Comp {...props} />
    }
    case 'url':
      // eslint-disable-next-line jsx-a11y/alt-text
      return <img src={icon.value} {...props} />
    default:
      return <></>
  }
}
