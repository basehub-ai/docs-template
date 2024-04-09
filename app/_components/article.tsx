import { ArticleFragment } from "@/basehub-helpers/fragments";
import { RichText } from "@/.basehub/react-rich-text";

export const Article = ({ data }: { data: ArticleFragment }) => {
  return (
    <article className="flex justify-center">
      <div className="prose w-full">
        <h1>{data._title}</h1>
        <RichText>{data.body?.json.content}</RichText>
      </div>
    </article>
  );
};
