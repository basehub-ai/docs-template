import { Container, Flex, Link, Separator, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { Pump } from '@/.basehub/react-pump'
import { BaseHubImage } from 'basehub/next-image'
import Image from 'next/image'
import { Logo } from '../logo'

import s from './footer.module.scss'

export const Footer = () => {
  return (
    <Pump
      queries={[
        {
          settings: {
            logo: { url: true },
            logoDark: { url: true },
            showUseTemplate: true,
          },
          footer: {
            links: { items: { url: true, icon: { url: true, alt: true } } },
            copyright: true,
          },
        },
      ]}
    >
      {async ([{ settings, footer }]) => {
        'use server'
        const logoLight = settings.logo.url
        const logoDark = settings.logoDark.url

        return (
          <Flex asChild justify="center" align="center" direction="column">
            <footer className={s.footer}>
              <Container py="9" mb="3" size="4" minWidth={{ sm: '526px' }}>
                <Flex justify="center" direction="column" align="center">
                  <Logo logoLight={logoLight} logoDark={logoDark} />

                  <Text
                    size="1"
                    as="p"
                    mt="3"
                    className={s['footer__copyright']}
                  >
                    {footer.copyright}
                  </Text>

                  <Separator
                    size="4"
                    mt="6"
                    mb="5"
                    className={s['footer__separator']}
                  />

                  {footer.links.items.length && (
                    <Flex maxWidth="max-content" mx="auto" gapX="3">
                      {footer.links.items.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url}
                          className={s['footer__link']}
                          color="gray"
                        >
                          <BaseHubImage
                            src={link.icon.url}
                            alt={link.icon.alt ?? ''}
                            width={20}
                            height={20}
                            style={{
                              width: 'calc(var(--space-5) * var(--scaling))',
                              height: 'calc(var(--space-5) * var(--scaling))',
                            }}
                          />
                        </Link>
                      ))}
                    </Flex>
                  )}

                  {settings.showUseTemplate && (
                    <Flex
                      maxWidth="max-content"
                      mx="auto"
                      asChild
                      align="center"
                      justify="center"
                      mt="8"
                    >
                      <NextLink
                        href="https://basehub.com/basehub/docs"
                        target="_blank"
                      >
                        <Image
                          src="https://basehub.com/template-button.svg"
                          width={150}
                          height={28}
                          style={{
                            height: 28,
                            width: 'auto',
                          }}
                          alt="Use BaseHub Template"
                        />
                      </NextLink>
                    </Flex>
                  )}
                </Flex>
              </Container>
            </footer>
          </Flex>
        )
      }}
    </Pump>
  )
}
