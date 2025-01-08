import { fragmentOn } from 'basehub'

export const SidebarOverridesFragment = fragmentOn(
  'SidebarOverridesComponent',
  {
    title: true,
    icon: true,
    markAsNew: true,
  }
)

export const ArticleLinkFragment = fragmentOn('ArticleLinkComponent', {
  _id: true,
  __typename: true,
  target: {
    _idPath: true,
    _slugPath: true,
    _title: true,
    sidebarOverrides: { title: true },
    excerpt: true,
  },
  anchor: true,
})

export type ArticleLinkFragment = fragmentOn.infer<typeof ArticleLinkFragment>
