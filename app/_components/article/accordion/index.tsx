import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'
import { Body } from '..'
import { AccordionGroupFragment } from './fragment'

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
