'use client'
import * as React from 'react'
import { Portal } from '@radix-ui/themes'
import s from './openapi.module.scss'

export const OpenApi = ({ url }: { url: string }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const shouldLoad = !!container

  React.useEffect(() => {
    const container = document.getElementById('content-container')
    if (container) {
      setContainer(container)
    }
  }, [])

  React.useEffect(() => {
    const headerHeight = document.querySelector('header')?.clientHeight ?? 0

    const handleScroll = () => {
      // if scroll is at the top minus header height, clear the URL hash
      if (window.scrollY < headerHeight) {
        window.history.replaceState(
          {},
          '',
          window.location.pathname + window.location.search
        )
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    if (!shouldLoad) return
    // Create script element
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.66'
    script.async = true

    // Add load and error handlers
    const handleLoad = () =>
      console.log('Scalar API Reference script loaded successfully')
    const handleError = (error: any) =>
      console.error('Error loading Scalar API Reference script:', error)

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    // Append to document
    document.body.appendChild(script)

    // Cleanup function
    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
      document.body.removeChild(script)
    }
  }, [shouldLoad])

  if (!container) {
    return (
      <>
        <style>{`#content-container-inner { opacity: 0; }`}</style>
        <Layout />
      </>
    )
  }
  return (
    <Portal container={container} style={{ width: '100%' }}>
      <style>{`
        #content-container { --header: var(--header-only); }
        #content-container-inner { display: none; }
      `}</style>
      <Layout>
        <script
          id="api-reference"
          data-configuration={JSON.stringify({
            spec: { url },
            searchHotKey: 'j',
            hideDarkModeToggle: true,
          })}
        />
      </Layout>
    </Portal>
  )
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return <div className={s.container}>{children}</div>
}
