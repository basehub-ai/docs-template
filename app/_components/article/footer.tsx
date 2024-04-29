import NextLink from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Card, Flex, Link, Separator, Text } from '@radix-ui/themes'

export type ArticleFooter = {
  prevArticle: { title: string; excerpt: string | null; href: string } | null
  nextArticle: { title: string; excerpt: string | null; href: string } | null
}

export const ArticleFooter = ({
  prevArticle,
  nextArticle,
}: ArticleFooter) => {
  return (
    <Box asChild px="9" mt="8">
      <footer>
        {prevArticle && (
          <Card asChild variant="surface">
            <Link asChild size="2">
              <NextLink href={prevArticle.href ?? '#'}>
                <Flex align="center">
                  <Flex mr="auto" align="center">
                    <ChevronLeftIcon color="gray" width={12} height={12} />
                    <Text size="1" mr="2" color="gray">
                      Previous
                    </Text>
                    <Separator orientation="vertical" />
                  </Flex>
                  <Text size="3" weight="medium">
                    {prevArticle.title}
                  </Text>
                  {prevArticle.excerpt && (
                    <Text size="2">{prevArticle.excerpt}</Text>
                  )}
                </Flex>
              </NextLink>
            </Link>
          </Card>
        )}

        {nextArticle && (
          <Card asChild variant="surface">
            <Link asChild mt="3" size="2">
              <NextLink href={nextArticle.href ?? '#'}>
                <Flex align="center">
                  <Box>
                    <Text size="3" weight="medium">
                      {nextArticle.title}
                    </Text>
                    {nextArticle.excerpt && (
                      <Text size="2">{nextArticle.excerpt}</Text>
                    )}
                  </Box>
                  <Flex ml="auto" align="center">
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
    </Box>
  )
}
