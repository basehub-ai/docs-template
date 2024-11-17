import { fragmentOn } from 'basehub'

export const AccordionGroupFragment = fragmentOn('AccordionGroupComponent', {
  _id: true,
  accordions: {
    items: { _id: true, _title: true, content: { json: { content: true } } },
  },
})

export type AccordionGroupFragment = fragmentOn.infer<
  typeof AccordionGroupFragment
>
