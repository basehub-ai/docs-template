/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const ContentOGWrapperResponse = async ({
  title,
  subtitle,
  logo,
}: {
  title: string
  subtitle: string
  logo: { url: string; alt: string | null }
}) => {
  // fonts
  const geist400 = fetch(
    new URL('../../public/font/geist/Geist-Regular.otf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const geist500 = fetch(
    new URL('../../public/font/geist/Geist-Medium.otf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          backgroundColor: 'white',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img style={{ width: 220 }} src={logo.url} alt={logo.alt ?? ''} />
        </div>
        <span
          style={{
            fontSize: 40,
            fontWeight: 500,
            fontStyle: 'normal',
            color: 'black',
            backgroundColor: '#EAEAEA',
            border: '3px solid #E0E0E0',
            borderRadius: 8,
            marginTop: 12,
            padding: '0 12px',
            lineHeight: 1.1,
            whiteSpace: 'pre-wrap',
          }}
        >
          Docs
        </span>
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontStyle: 'normal',
            color: 'black',
            marginTop: 30,
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>{truncateString(title, 35)}</b>
        </div>
        <p
          style={{
            display: 'flex',
            fontSize: 32,
            fontStyle: 'normal',
            color: '#909090',
            marginTop: 8,
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
          }}
        >
          {truncateString(subtitle, 200)}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist 400',
          data: await geist400,
        },
        {
          name: 'Geist 500',
          data: await geist500,
        },
      ],
    }
  )
}

function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  } else {
    return str
  }
}
