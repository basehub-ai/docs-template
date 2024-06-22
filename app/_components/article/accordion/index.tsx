import { fragmentOn } from 'basehub'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'
import { Body } from '..'

export const AccordionComponent = ({ accordions }: AccordionGroupFragment) => {
  return (
    <Accordion type="multiple">
      {accordions.items.map((accordion) => (
        <AccordionItem key={accordion._id} value={accordion._id}>
          <AccordionTrigger>{accordion._title}</AccordionTrigger>
          <AccordionContent>
            <Body>{accordion.content?.json.content}</Body>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const AccordionGroupFragment = fragmentOn('AccordionGroupComponent', {
  _id: true,
  accordions: {
    items: { _id: true, _title: true, content: { json: { content: true } } },
  },
})

type AccordionGroupFragment = fragmentOn.infer<typeof AccordionGroupFragment>
