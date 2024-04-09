import { ArticleFragment } from "@/basehub-helpers/fragments";
import { RichText } from "@/.basehub/react-rich-text";
import { clsx } from "clsx";
import { CalloutComponent } from "./callout";
import { HeadingWithIconComponent } from "./heading-with-icon";

import s from "./article.module.scss";

export const Article = ({ data }: { data: ArticleFragment }) => {
  return (
    <article className={clsx("flex justify-center")}>
      <div className={s.body}>
        <h1>{data._title}</h1>
        <RichText
          blocks={data.body?.json.blocks}
          components={{ CalloutComponent, HeadingWithIconComponent }}
        >
          {data.body?.json.content}
        </RichText>
      </div>
    </article>
  );
};
