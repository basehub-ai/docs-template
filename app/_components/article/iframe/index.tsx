import { fragmentOn } from 'basehub'
import { IFrameWithFadeIn } from './iframe-with-fade-in'

export const IFrameComponent = (props: IFrameFragment) => {
  return (
    <picture style={{ maxWidth: '100%', width: '100%' }}>
      <IFrameWithFadeIn {...props} />
    </picture>
  )
}

export const IFrameFragment = fragmentOn('IFrameComponent', {
  _id: true,
  src: true,
})

export type IFrameFragment = fragmentOn.infer<typeof IFrameFragment>
