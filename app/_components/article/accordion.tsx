'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { fragmentOn } from '@/.basehub'
import { AccordionGroupComponent } from '@/.basehub/schema'
import { RichText } from 'basehub/react-rich-text'

export const AccordionComponent = ({
  _title,
  accordions,
}: AccordionGroupComponent) => {
  return (
    <Accordion type="single" collapsible>
      {accordions.items.map((accordion) => (
        <AccordionItem key={accordion._id} value={accordion._id}>
          <AccordionTrigger>{accordion._title}</AccordionTrigger>
          <AccordionContent>
            <RichText>{accordion.content?.json.content}</RichText>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const AccordionFragment = fragmentOn('AccordionGroupComponent', {
  _id: true,
  _title: true,
  accordions: {
    items: {
      _id: true,
      _title: true,
      content: { json: { content: true } },
    },
  },
})

type AccordionFragment = fragmentOn.infer<typeof AccordionFragment>

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
