/* eslint-disable @next/next/no-img-element */
import { fragmentOn } from 'basehub'
import { Box, Card, Grid, Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'

export const CardsGridComponent = ({ cards }: CardsGridFragment) => {
  return (
    <Grid columns={{ xs: '1', sm: cards.items.length > 1 ? '2' : '1' }} gap="4">
      {cards.items.map((card) => {
        return (
          <Card key={card._id} size="2" asChild>
            <Link href={card.href ?? '#'}>
              {(card.icon.light || card.icon.dark) && (
                <Box mb="1">
                  {card.icon.light?.url && (
                    <img
                      style={{ height: 24 }}
                      src={card.icon.light?.url}
                      alt={card._title + ' icon light'}
                      {...(card.icon.dark ? { 'data-light-only': true } : {})}
                    />
                  )}
                  {card.icon.dark?.url && (
                    <img
                      style={{ height: 24 }}
                      src={card.icon.dark?.url}
                      alt={card._title + ' icon dark'}
                      {...(card.icon.light ? { 'data-dark-only': true } : {})}
                    />
                  )}
                </Box>
              )}
              <Heading style={{ fontWeight: 600 }} size="3" as="h6">
                {card._title}
              </Heading>
              {card.description && (
                <Text color="gray" size="2" mt="1" as="p">
                  {card.description}
                </Text>
              )}
            </Link>
          </Card>
        )
      })}
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

type CardsGridFragment = fragmentOn.infer<typeof CardsGridFragment>
