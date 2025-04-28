'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'

import { IconButton } from '@radix-ui/themes'
import { useCopyToClipboard } from 'basehub/react-code-block/client'

export const CopyButton = ({
  style,
}: {
  style?: React.JSX.IntrinsicElements['button']['style']
}) => {
  const { onCopy, copied } = useCopyToClipboard({ copiedDurationMs: 2000 })

  return (
    <IconButton
      style={style}
      size="1"
      variant="surface"
      color="gray"
      onClick={onCopy}
    >
      {copied ? (
        <CheckIcon width={12} height={12} />
      ) : (
        <CopyIcon width={12} height={12} />
      )}
    </IconButton>
  )
}
