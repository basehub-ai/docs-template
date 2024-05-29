import { Container, Flex, Link, Separator, Text } from '@radix-ui/themes'
import { draftMode } from 'next/headers'
import NextLink from 'next/link'
import { Pump } from '@/.basehub/react-pump'
import Image from 'next/image'
import { Logo } from '../logo'

import s from './footer.module.scss'

export const Footer = () => {
  return (
    <Pump
      queries={[
        {
          settings: { logo: { url: true }, logoDark: { url: true } },
          footer: {
            links: { items: { url: true, icon: { url: true, alt: true } } },
            copyright: true,
            showPoweredByBaseHub: true,
          },
        },
      ]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
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
                  <Logo logoLight={logoLight} logoDark={logoDark} size="lg" />

                  <Text
                    size="2"
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
                    <Flex maxWidth="max-content" mx="auto" mb="8">
                      {footer.links.items.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url}
                          className={s['footer__link']}
                          color="gray"
                          mr="3"
                        >
                          <Image
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

                  {footer.showPoweredByBaseHub && (
                    <Flex
                      maxWidth="max-content"
                      mx="auto"
                      asChild
                      align="center"
                      justify="center"

                    >
                        <NextLink
                          href="https://basehub.com/basehub/docs"
                          target='_blank'
                        >
                          <Image
                            src="https://basehub.dev/edit-in-basehub.svg"
                            width={150}
                            height={28}
                            alt="Edit in BaseHub"
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
