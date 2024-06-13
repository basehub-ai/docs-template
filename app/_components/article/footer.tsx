import NextLink from 'next/link'
import { ChevronRightIcon,  } from '@radix-ui/react-icons'
import {
  Box,
  Card,
  Container,
  Flex,
  Link,
  Separator,
  Text,
} from '@radix-ui/themes'
import { ArticleFragment } from '@/basehub-helpers/fragments'
import { formatDistance } from 'date-fns'

import s from './article.module.scss'
import { Feedback } from '../analytics/feedback'

export type ArticleFooter = {
  lastUpdatedAt: ArticleFragment['_sys']['lastModifiedAt'] | null
  nextArticle: { title: string; href: string } | null
  _analyticsKey?: string
}

export const ArticleFooter = ({
  lastUpdatedAt,
  nextArticle,
  _analyticsKey
}: ArticleFooter) => {
  console.log('ArticleFooter', lastUpdatedAt, nextArticle, _analyticsKey)
  const lastUpdatedFormatted = formatDistance(
    new Date(lastUpdatedAt ?? new Date()),
    new Date(),
  )
  return (
    <Container asChild mt="9" width="100%" flexGrow="0">
      <footer className={s['article-footer']}>
        {lastUpdatedAt && (
          <Text size="2" weight="medium" color="gray" mb="2">
            Last updated {lastUpdatedFormatted}
          </Text>
        )}

        {nextArticle && (
          <Card asChild variant="surface">
            <Link asChild mt="3" size="2">
              <NextLink href={nextArticle.href ?? '#'}>
                <Flex align="center">
                  <Box>
                    <Text size="3" weight="medium">
                      {nextArticle.title || 'Untitled article'}
                    </Text>
                  </Box>
                  <Flex ml="auto" align="center">
                    {_analyticsKey && (
                      <Feedback analyticsKey={_analyticsKey} />
                    )}
                    <Separator orientation="vertical" />
                    <Text size="1" ml="2" color="gray">
                      Up next
                    </Text>
                    <ChevronRightIcon color="gray" width={12} height={12} />
                  </Flex>
                </Flex>
              </NextLink>
            </Link>
          </Card>
        )}
      </footer>
    </Container>
  )
}
