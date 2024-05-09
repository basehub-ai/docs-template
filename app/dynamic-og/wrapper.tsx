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
          padding: '40px 80px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottom: '1px solid rgba(224, 224, 224, 0.05)',
          gap: 24,
        }}
      >
        <img src={logo.url} alt={logo.alt ?? 'logo'} style={{ width: 184 }} />
        <span
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: '#DDD',
          }}
        >
          /
        </span>
        <span
          style={{
            color: '#000',
            fontFamily: 'Geist Sans',
            fontSize: 40,
            fontWeight: 600,
            lineHeight: '115%',
            letterSpacing: '-1.6px',
          }}
        >
          Docs
        </span>
      </div>

      <div style={{ display: 'flex', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            marginTop: 20,
            padding: '0 0 136px 80px',
            width: '100%',
          }}
        >
          <h1
            style={{
              color: '#202020',
              fontFamily: 'Geist Sans',
              fontSize: 84,
              fontWeight: 500,
              lineHeight: '115%',
              letterSpacing: '-3.36px',
              textAlign: 'left',
            }}
          >
            {truncateString(title, 35)}
          </h1>
          <p
            style={{
              color: '#646464',
              fontFamily: 'Geist Sans',
              fontSize: 44,
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '-1.76px',
              maxWidth: '90%',
              marginTop: 0,
              marginBottom: 80,
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
          padding: '40px 80px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottom: '1px solid rgba(224, 224, 224, 0.05)',
          gap: 24,
        }}
      >
        <img src={logo.url} alt={logo.alt ?? 'logo'} style={{ width: 184 }} />
        <span
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.40)',
          }}
        >
          /
        </span>
        <span
          style={{
            color: '#FFF',
            fontFamily: 'Geist Sans',
            fontSize: 40,
            fontWeight: 600,
            lineHeight: '115%',
            letterSpacing: '-1.6px',
          }}
        >
          Docs
        </span>
      </div>

      <div style={{ display: 'flex', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            marginTop: 20,
            padding: '0 0 136px 80px',
            width: '100%',
          }}
        >
          <h1
            style={{
              color: '#FFFFFF',
              fontFamily: 'Geist Sans',
              fontSize: 84,
              fontWeight: 500,
              lineHeight: '115%',
              letterSpacing: '-3.36px',
              textAlign: 'left',
            }}
          >
            {truncateString(title, 35)}
          </h1>
          <p
            style={{
              color: '#B4B4B4',
              fontFamily: 'Geist Sans',
              fontSize: 44,
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '-1.76px',
              maxWidth: '90%',
              marginTop: 0,
              marginBottom: 80,
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
