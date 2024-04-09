import { ArticleFragment } from "@/basehub-helpers/fragments";
import { RichText } from "@/.basehub/react-rich-text";
import { clsx } from "clsx";
import s from "./article.module.scss";

export const Article = ({ data }: { data: ArticleFragment }) => {
  return (
    <article className={clsx("flex justify-center")}>
      <div className={s.body}>
        <h1>{data._title}</h1>
        <RichText>{data.body?.json.content}</RichText>
      </div>
    </article>
  );
};
