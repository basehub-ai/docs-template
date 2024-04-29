/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const ContentOGWrapperResponse = async ({
  title,
  subtitle,
  logo,
  accentColor,
}: {
  title: string
  subtitle: string
  logo: { url: string; alt: string | null }
  accentColor: string
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
          backgroundColor: 'black',
          backgroundSize: '150px 150px',
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 450,
            marginLeft: 60,
            marginRight: 60,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <img
              style={{
                width: 254,
                height: 69,
                objectFit: 'cover',
                display: 'flex',
              }}
              src={logo.url}
              alt={logo.alt ?? 'logo'}
            />
            <p
              style={{
                fontSize: 48,
                fontFamily: 'Geist 400',
                color: accentColor,
                lineHeight: 1.5,
              }}
            >
              Docs
            </p>
          </div>

          <div
            style={{
              width: '100%',
              height: 450,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              paddingRight: 100,
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontFamily: 'Geist 500',
                color: 'white',
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              {truncateString(title, 35)}
            </h1>
            <p
              style={{
                fontSize: 32,
                fontFamily: 'Geist 400',
                color: '#909090',
                lineHeight: 1.5,
              }}
            >
              {truncateString(subtitle, 200)}
            </p>
          </div>
        </div>
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

export function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  } else {
    return str
  }
}
