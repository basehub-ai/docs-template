import { Container, Flex, Link, Separator, Text } from '@radix-ui/themes'
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { draftMode } from 'next/headers'
import NextLink from 'next/link'
import { Pump } from '@/.basehub/react-pump'

import s from './footer.module.scss'
import Image from 'next/image'

export const Footer = () => {
  return (
    <Pump
      queries={[{ settings: { logo: { url: true } } }]}
      next={{ revalidate: 30 }}
      draft={draftMode().isEnabled}
    >
      {async ([data]) => {
        'use server'
        const logo = data.settings.logo.url

        return (
          <Flex asChild justify="center" align="center" direction="column">
            <footer className={s.footer}>
              <Container
                className={s.container}
                py="9"
                mb="3"
                size="4"
                minWidth={{ sm: '526px' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt="logo"
                  className={s['footer__logo']}
                />
                <Text size="2" as="p" mt="3" className={s['footer__copyright']}>
                  © wireframe Ltd. All rights reserved.
                </Text>

                <Separator
                  size="4"
                  mt="6"
                  mb="5"
                  className={s['footer__separator']}
                />

                <Flex maxWidth="max-content" mx="auto" mb="8">
                  <Link
                    href="https://twitter.com/#"
                    className={s['footer__link']}
                    color="gray"
                    mr="3"
                  >
                    <TwitterLogoIcon width="18" height="18" />
                  </Link>
                  <Link
                    href="https://linkedin.com/#"
                    className={s['footer__link']}
                    color="gray"
                    mr="3"
                  >
                    <LinkedInLogoIcon width="18" height="18" />
                  </Link>
                  <Link
                    href="https://github.com/#"
                    className={s['footer__link']}
                    color="gray"
                    mr="3"
                  >
                    <GitHubLogoIcon width="18" height="18" />
                  </Link>
                  <Link
                    href="https://discord.com/#"
                    className={s['footer__link']}
                    color="gray"
                  >
                    <DiscordLogoIcon width="18" height="18" />
                  </Link>
                </Flex>

                <Flex
                  maxWidth="max-content"
                  mx="auto"
                  asChild
                  align="center"
                  justify="center"
                >
                  <Link asChild size="2" color='gray'>
                    <NextLink
                      href="https://basehub.com/home"
                      className={s['footer__badge']}
                    >
                      <Image
                        src="/basehub.svg"
                        width={11}
                        height={14}
                        alt="BaseHub logo"
                      />
                      &nbsp;&nbsp;Powered by&nbsp;
                      <Text as="span" color="orange">
                        BaseHub
                      </Text>
                    </NextLink>
                  </Link>
                </Flex>
              </Container>
            </footer>
          </Flex>
        )
      }}
    </Pump>
  )
}
