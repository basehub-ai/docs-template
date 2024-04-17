export default async function ArticleLayout({
  children,
}: {
  children?: React.ReactNode
  params: { category: string; slug: string[] }
}) {
  return (
    <main className="flex min-h-screen w-full items-start gap-x-8 py-8">
      {children}
    </main>
  )
}
