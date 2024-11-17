import { fragmentOn } from 'basehub'
import { CalloutFragment } from '@/app/_components/article/callout-fragment'
import { CardsGridFragment } from '@/app/_components/article/cards-grid-fragment'
import { CodeGroupFragment } from '@/app/_components/article/code-snippet/fragment'
import { CodeSnippetFragmentRecursive } from '@/app/_components/article/code-snippet/fragment'

export const StepperFragment = fragmentOn('StepperComponent', {
  __typename: true,
  _id: true,
  stepperContent: {
    json: {
      content: true,
      blocks: {
        __typename: true,
        on_CalloutComponent: CalloutFragment,
        on_CardsGridComponent: CardsGridFragment,
        on_CodeGroupComponent: CodeGroupFragment,
        on_CodeSnippetComponent: CodeSnippetFragmentRecursive,
      },
    },
  },
})

export type StepperFragment = fragmentOn.infer<typeof StepperFragment>
