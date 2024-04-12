import * as React from 'react'
import { fragmentOn } from '@/.basehub'

import { StepController } from './step-controller'
import { Body } from '..'

export const StepperComponent = async ({
  _id,
  stepperContent,
}: StepperFragment) => {
  let checkpoints = 0

  return (
    <div data-type="stepper" data-stepper-id={_id}>
      <Body
        components={{
          h3: ({ children, ...rest }) => {
            checkpoints++

            return (
              <StepController stepperId={_id} stepId={rest.id}>
                <h3
                  {...rest}
                  data-type="stepper-checkpoint"
                  className="relative"
                >
                  {children}
                  <span>{checkpoints}</span>
                </h3>
              </StepController>
            )
          },
        }}
      >
        {stepperContent.json.content}
      </Body>
    </div>
  )
}

export const StepperFragment = fragmentOn('StepperComponent', {
  __typename: true,
  _id: true,
  stepperContent: { json: { content: true } },
})

export type StepperFragment = fragmentOn.infer<typeof StepperFragment>
