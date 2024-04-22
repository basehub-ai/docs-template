import { fragmentOn } from '@/.basehub'
import { Card, Grid } from '@radix-ui/themes'

export const CardsGridComponent = ({ _title, cards }: CardsGridFragment) => {
  return (
    <div data-type="cards-grid">
      <h2>{_title}</h2>
      <Grid columns={{ xs: '1', sm: '2' }} gap="4">
        {cards.items.map((card) => (
          <Card key={card._id}>
            <h3 style={{ marginTop: 0 }}>{card._title}</h3>
            <p>{card.description}</p>
          </Card>
        ))}
      </Grid>
    </div>
  )
}

export const CardsGridFragment = fragmentOn('CardsGridComponent', {
  _id: true,
  _title: true,
  cards: {
    items: {
      _id: true,
      _title: true,
      description: true,
    },
  },
})

type CardsGridFragment = fragmentOn.infer<typeof CardsGridFragment>
