'use client'

import * as React from 'react'

export const StepController = ({
  children,
  stepperId,
  stepId,
}: {
  children: React.ReactNode
  stepperId: string
  stepId: string
}) => {
  React.useEffect(() => {
    const steps = document.querySelectorAll(
      `h3[data-type="stepper-checkpoint"]`
    )

    const elementIsStepContent = (element: HTMLElement) => {
      const stepper = document.querySelector(`[data-stepper-id="${stepperId}"]`)
      return stepper?.contains(element)
    }

    const heightUntilNextH3 = (
      node: HTMLElement,
      accumulator: number
    ): number => {
      const nextNode = node.nextElementSibling as HTMLElement
      if (!elementIsStepContent(nextNode) && nextNode) return accumulator
      if (!nextNode) return accumulator + node.offsetHeight
      if (nextNode.tagName !== 'H3')
        return heightUntilNextH3(
          nextNode,
          nextNode.offsetTop - node.offsetTop + accumulator
        )

      return nextNode.offsetTop - node.offsetTop + accumulator
    }

    steps.forEach((step) => {
      if (
        !(step instanceof HTMLHeadingElement) ||
        !step.id ||
        step.id !== stepId
      )
        return

      const height =
        heightUntilNextH3(step as HTMLHeadingElement, 0) - step.offsetHeight - 8
      step.style.setProperty('--step-title-height', `${step.offsetHeight}px`)
      step.style.setProperty('--step-height', `${height}px`)
    })
  }, [stepId, stepperId])

  return children
}
