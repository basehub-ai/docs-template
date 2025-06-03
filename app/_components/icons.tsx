import * as React from 'react'
import { SVGProps } from 'react'

export const MoonIcon = ({
  width,
  height,
  color,
}: {
  width: number
  height: number
  color: string
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.501 10a6.5 6.5 0 0 1-8.503-8.503 6.502 6.502 0 1 0 8.503 8.504Z"
      />
    </svg>
  )
}

export const SunIcon = ({
  width,
  height,
  color,
}: {
  width: number
  height: number
  color: string
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 2v1.5m4.243.257-1.061 1.061M14 8h-1.5m-.257 4.243-1.061-1.061M8 12.5V14m-3.182-2.818-1.06 1.06M3.5 8H2m2.818-3.182-1.06-1.06M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
      />
    </svg>
  )
}

export const StartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    viewBox="0 0 15 15"
    {...props}
  >
    <path fill="currentColor" d="M2.127 5.9H14.5l-1.66 3.238H.5L2.127 5.9Z" />
  </svg>
)
