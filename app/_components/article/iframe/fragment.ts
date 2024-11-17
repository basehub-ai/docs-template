import { fragmentOn } from 'basehub'

export const IFrameFragment = fragmentOn('IFrameComponent', {
  _id: true,
  src: true,
})

export type IFrameFragment = fragmentOn.infer<typeof IFrameFragment>
