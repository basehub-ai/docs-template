'use client'

import { ArticleFragment } from '@/basehub-helpers/fragments'
import { Card, Grid, Heading, Text } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export const ArticleIndex = ({
  articles,
}: {
  articles: ArticleFragment['children']['items']
}) => {
  const pathname = usePathname()

  return (
    <Grid columns={{ xs: '1', sm: '2' }} gap="4">
      {articles.map((article) => (
        <Card key={article._id} size="2" asChild>
          <Link href={`${pathname}/${article._slug}`} color="gray">
            <Heading style={{ fontWeight: 600 }} size="3" as="h6">
              {article._title ?? 'Untiled article'}
            </Heading>
            {article.excerpt && (
              <Text color="gray" size="2" mt="1" as="p">
                {article.excerpt}
              </Text>
            )}
          </Link>
        </Card>
      ))}
    </Grid>
  )
}
