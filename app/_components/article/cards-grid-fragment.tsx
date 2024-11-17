import { fragmentOn } from 'basehub'

export const CardsGridFragment = fragmentOn('CardsGridComponent', {
  _id: true,
  _title: true,
  cards: {
    items: {
      _id: true,
      _title: true,
      href: true,
      description: true,
      icon: {
        light: {
          url: true,
        },
        dark: {
          url: true,
        },
      },
    },
  },
})

export type CardsGridFragment = fragmentOn.infer<typeof CardsGridFragment>
