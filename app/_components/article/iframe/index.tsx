import { IFrameWithFadeIn } from './iframe-with-fade-in'
import { IFrameFragment } from './fragment'

export const IFrameComponent = (props: IFrameFragment) => {
  return (
    <picture style={{ maxWidth: '100%', width: '100%' }}>
      <IFrameWithFadeIn {...props} />
    </picture>
  )
}
