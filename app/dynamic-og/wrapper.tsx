/* eslint-disable @next/next/no-img-element */
import { ThemeProps } from '@radix-ui/themes'
import {} from '@radix-ui/themes'
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
  accentColor: ThemeProps['accentColor']
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
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          backgroundColor: 'white',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            padding: '30px 80px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(224, 224, 224, 0.10)',
            backgroundImage:
              'linear-gradient(90deg, rgba(252, 252, 252, 0.80) 0%, #FCFCFC 50%, rgba(252, 252, 252, 0.70) 100%)',
          }}
        >
          <span
            style={{
              color: '#838383',
              fontFamily: 'Geist',
              fontSize: 24,
              fontWeight: 600,
              lineHeight: '115%',
              letterSpacing: 2.4,
              textTransform: 'uppercase',
            }}
          >
            Docs
          </span>
          <img style={{ width: 148 }} src={logo.url} alt={logo.alt ?? 'logo'} />
        </div>

        <hr
          style={{
            height: 1,
            opacity: 0.34,
            backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            width: '100%',
          }}
        />

        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              marginTop: 90,
              padding: '0 0 136px 80px',
              width: '100%',
            }}
          >
            <h1
              style={{
                color: '#202020',
                fontFamily: 'Geist',
                fontSize: 64,
                fontWeight: 500,
                lineHeight: '115%',
                letterSpacing: '-2.56px',
                textAlign: 'left',
              }}
            >
              {truncateString(title, 35)}
            </h1>
            <p
              style={{
                color: '#646464',
                fontFamily: 'Geist',
                fontSize: 32,
                fontWeight: 400,
                lineHeight: '140%',
                letterSpacing: '-1.28px',
                maxWidth: '90%',
                marginTop: 16,
                marginBottom: 136,
              }}
            >
              {truncateString(subtitle, 200)}
            </p>
            <hr
              style={{
                height: 1,
                opacity: 0.1,
                backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 34%, transparent 100%)`,
                width: '260%',
              }}
            />
          </div>
          <hr
            style={{
              opacity: 0.1,
              backgroundImage: `linear-gradient(180deg, #FFF 0%, ${accentColor} 34%, transparent 100%)`,
              position: 'relative',
              backgroundColor: 'green',
              width: 1,
              height: '100%',
              top: 290,
              left: 200,
              transform: 'rotateZ(90deg)',
            }}
          />
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

function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  } else {
    return str
  }
}
