import * as React from 'react'

import { StepController } from './step-controller'
import { Body } from '..'
import { Box, Heading } from '@radix-ui/themes'
import { StepperFragment } from './fragment'
import { ArticleLinkMark } from '../../article-link/mark'

import s from './stepper.module.scss'

export const StepperComponent = async ({
  _id,
  stepperContent,
}: StepperFragment) => {
  let checkpoints = 0

  return (
    <Box
      data-stepper-id={_id}
      pl={{ initial: '6', md: '7' }}
      className={s.stepper}
    >
      <Body
        blocks={stepperContent.json.blocks}
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
                  <span data-llms-ignore>{checkpoints}</span>
                </Heading>
              </StepController>
            )
          },
          ArticleLinkComponent_mark: ArticleLinkMark,
        }}
      >
        {stepperContent.json.content}
      </Body>
    </Box>
  )
}
