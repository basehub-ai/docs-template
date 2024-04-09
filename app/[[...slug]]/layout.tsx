import { pageBySlug } from "@/basehub-helpers/fragments";
import { notFound } from "next/navigation";
import { Sidebar } from "../_components/sidebar";
import { Pump } from "@/.basehub/react-pump";

export default async function ArticleLayout({
  children,
  params,
}: {
  children?: React.ReactNode;
  params: { slug: string | undefined };
}) {
  const page = params.slug?.[0];

  return (
    <div className="flex gap-8 container mx-auto">
      <div className="w-80">
        <Pump queries={[{ pages: pageBySlug(page) }]}>
          {async ([data]) => {
            "use server";

            const page = data.pages.items[0];
            if (!page) notFound();

            return (
              <Sidebar
                data={page.articles}
                level={0}
                pathname={`/${page._slug}`}
              />
            );
          }}
        </Pump>
      </div>
      <main className="min-h-screen py-8 w-full">{children}</main>
    </div>
  );
}
