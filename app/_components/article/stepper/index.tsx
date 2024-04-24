import * as React from 'react'
import { fragmentOn } from '@/.basehub'

import { StepController } from './step-controller'
import { Body } from '..'
import { Box, Heading } from '@radix-ui/themes'

export const StepperComponent = async ({
  _id,
  stepperContent,
}: StepperFragment) => {
  let checkpoints = 0

  return (
    <Box data-stepper-id={_id} pl={{ initial: '6', lg: '0' }}>
      <Body
        components={{
          h3: ({ children, ...rest }) => {
            checkpoints++

            return (
              <StepController stepperId={_id} stepId={rest.id}>
                <Heading
                  as="h3"
                  {...rest}
                  data-type="stepper-checkpoint"
                  style={{ position: 'relative' }}
                  size="4"
                  mb="3"
                  mt="5"
                >
                  {children}
                  <span>{checkpoints}</span>
                </Heading>
              </StepController>
            )
          },
        }}
      >
        {stepperContent.json.content}
      </Body>
    </Box>
  )
}

export const StepperFragment = fragmentOn('StepperComponent', {
  __typename: true,
  _id: true,
  stepperContent: { json: { content: true } },
})

export type StepperFragment = fragmentOn.infer<typeof StepperFragment>
