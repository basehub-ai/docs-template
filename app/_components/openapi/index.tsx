'use client'
import * as React from 'react'
import { Portal } from '@radix-ui/themes'
import { ApiReferenceReact } from '@scalar/api-reference-react'
import s from './openapi.module.scss'

export const OpenApi = ({ url }: { url: string }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

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
      <style>{`#content-container-inner { display: none; }`}</style>
      <Layout>
        <ApiReferenceReact
          configuration={{
            spec: { url },
            searchHotKey: 'j',
            hideDarkModeToggle: true,
          }}
        />
      </Layout>
    </Portal>
  )
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return <div className={s.container}>{children}</div>
}
