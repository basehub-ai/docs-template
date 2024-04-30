import { fragmentOn } from '@/.basehub'
import { Card, Grid, Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'

export const CardsGridComponent = ({ cards }: CardsGridFragment) => {
  return (
    <Grid columns={{ xs: '1', sm: '2' }} gap="4">
      {cards.items.map((card) => (
        <Card key={card._id} size="2" asChild>
          <Link href={card.href ?? '#'}>
            <Heading style={{ fontWeight: 600 }} size="3" as="h6">
              {card._title}
            </Heading>
            <Text color="gray" size="2" mt="1" as="p">
              {card.description}
            </Text>
          </Link>
        </Card>
      ))}
    </Grid>
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
