import { fragmentOn } from '@/.basehub'

export const IFrameComponent = (props: IFrameFragment) => {
  return (
    <picture
      style={{
        maxWidth: '100%',
        width: '100%',
      }}
    >
      <iframe
        src={props.src}
        width="100%"
        style={{
          border: 'none',
          width: '100%',
          aspectRatio: '16 / 9',
        }}
      />
    </picture>
  )
}

export const IFrameFragment = fragmentOn('IFrameComponent', {
  _id: true,
  _title: true,
  src: true,
})

type IFrameFragment = fragmentOn.infer<typeof IFrameFragment>
