/* eslint-disable @next/next/no-img-element */
import { ThemeProps } from '@radix-ui/themes'
import {} from '@radix-ui/themes'
import { ImageResponse } from 'next/og'

type OGWrapper = {
  title: string
  subtitle: string
  logo: { url: string; alt: string | null }
  accentColor: ThemeProps['accentColor']
  theme: 'light' | 'dark' | 'system'
}

export const ContentOGWrapperResponse = async ({
  theme,
  ...props
}: OGWrapper) => {
  // fonts
  const geist400 = fetch(
    new URL('../../public/font/geist/Geist-Regular.otf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const geist500 = fetch(
    new URL('../../public/font/geist/Geist-Medium.otf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    theme === 'dark' ? <DarkThemeOG {...props} /> : <LightThemeOG {...props} />,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist 400', data: await geist400 },
        { name: 'Geist 500', data: await geist500 },
      ],
    }
  )
}

const LightThemeOG = ({
  title,
  subtitle,
  logo,
  accentColor,
}: Omit<OGWrapper, 'theme'>) => {
  return (
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
          borderBottom: '1px solid rgba(224, 224, 224, 0.05)',
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
          margin: 0,
          height: 1,
          opacity: 0.34,
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          width: '100%',
        }}
      />

      <div style={{ display: 'flex', position: 'relative' }}>
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
              maxWidth: '80%',
              marginTop: 16,
              marginBottom: 136,
            }}
          >
            {truncateString(subtitle, 200)}
          </p>
          <hr
            style={{
              margin: 0,
              height: 1,
              opacity: 0.1,
              backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 34%, transparent 100%)`,
              width: '150%',
            }}
          />
        </div>
        <hr
          style={{
            margin: 0,
            opacity: 0.2,
            backgroundImage: `linear-gradient(180deg, transparent 0%, ${accentColor} 34%, transparent 100%)`,
            width: 1,
            height: '130%',
            transform: 'rotateZ(90deg)',
            position: 'absolute',
            top: 25,
            right: 90,
          }}
        />
      </div>
    </div>
  )
}

const DarkThemeOG = ({
  title,
  subtitle,
  logo,
  accentColor,
}: Omit<OGWrapper, 'theme'>) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: '#09090B',
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
          borderBottom: '1px solid rgba(224, 224, 224, 0.05)',
          background: 'rgba(39, 39, 42, 0.1)',
        }}
      >
        <span
          style={{
            color: '#B4B4B4',
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
          margin: 0,
          height: 1,
          opacity: 0.34,
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          width: '100%',
          transform: 'translateY(-2px)',
          position: 'relative',
        }}
      />

      <div style={{ display: 'flex', position: 'relative' }}>
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
              color: '#FFFFFF',
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
              color: '#B4B4B4',
              fontFamily: 'Geist',
              fontSize: 32,
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '-1.28px',
              maxWidth: '80%',
              marginTop: 16,
              marginBottom: 136,
            }}
          >
            {truncateString(subtitle, 200)}
          </p>
          <hr
            style={{
              margin: 0,
              height: 1,
              opacity: 0.1,
              backgroundImage: `linear-gradient(90deg, transparent 0%, ${accentColor} 34%, transparent 100%)`,
              position: 'relative',
              width: '150%',
            }}
          />
        </div>
        <hr
          style={{
            margin: 0,
            opacity: 0.2,
            backgroundImage: `linear-gradient(180deg, transparent 0%, ${accentColor} 34%, transparent 100%)`,
            width: 1,
            height: '130%',
            transform: 'rotateZ(90deg)',
            position: 'absolute',
            top: 25,
            right: 90,
          }}
        />
      </div>
    </div>
  )
}

function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...'
  } else {
    return str
  }
}
