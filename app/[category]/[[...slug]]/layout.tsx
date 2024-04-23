import { Flex } from '@radix-ui/themes'

export default async function ArticleLayout({
  children,
}: {
  children?: React.ReactNode
  params: { category: string; slug: string[] }
}) {
  return (
    <Flex asChild minHeight="100vh" width="100%" align="start" gapX="6" py="6">
      <main>{children}</main>
    </Flex>
  )
}
