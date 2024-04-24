import { fragmentOn } from '@/.basehub'
import { Card, Grid, Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'

export const CardsGridComponent = ({ _title, cards }: CardsGridFragment) => {
  return (
    <div data-type="cards-grid">
      <Heading as="h2" mb="4">{_title}</Heading>
      <Grid columns={{ xs: '1', sm: '2' }} gap="4">
        {cards.items.map((card) => (
          <Card key={card._id} size="2" asChild>
            <Link href={card.href ?? '#'}>
              <Heading weight="bold" size="3" as="h6">
                {card._title}
              </Heading>
              <Text color="gray" size="2" mt="1">
                {card.description}
              </Text>
            </Link>
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
      href: true,
      description: true,
    },
  },
})

type CardsGridFragment = fragmentOn.infer<typeof CardsGridFragment>
