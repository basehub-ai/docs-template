// 'use client'

import * as React from 'react'

import { StepperFragment } from '.'
import { Body } from '..'

export const Stepper = ({
  stepperContent,
}: {
  stepperContent: StepperFragment['stepperContent']
}) => {
  let checkpoints = 0

  return (
    <div data-type="stepper">
      <Body
        // @ts-ignore
        components={{
          h3: ({ children, ...rest }) => {
            checkpoints++

            return (
              <h3 {...rest} data-type="stepper-checkpoint" className="relative">
                {children}
                <div>{checkpoints}</div>
              </h3>
            )
          },
        }}
      >
        {stepperContent.json.content}
      </Body>
    </div>
  )
}
