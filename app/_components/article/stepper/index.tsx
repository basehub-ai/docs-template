import * as React from 'react'
import { fragmentOn } from '@/.basehub'

import { Stepper } from './stepper'

export const StepperComponent = ({ _id, stepperContent }: StepperFragment) => {
  return <Stepper stepperContent={stepperContent} />
}

export const StepperFragment = fragmentOn('StepperComponent', {
  __typename: true,
  _id: true,
  stepperContent: { json: { content: true } },
})

export type StepperFragment = fragmentOn.infer<typeof StepperFragment>
