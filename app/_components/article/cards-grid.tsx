/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Card,
  Grid,
  Heading,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes'
import Link from 'next/link'
import { CardsGridFragment } from './cards-grid-fragment'

export const CardsGridComponent = ({ cards }: CardsGridFragment) => {
  return (
    <>
      <Grid
        columns={{ xs: '1', sm: cards.items.length > 1 ? '2' : '1' }}
        gap="4"
        data-llms-ignore
      >
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

      {/* llms only */}
      <VisuallyHidden>
        {cards.items.map((card) => {
          return (
            <Link href={card.href ?? '#'} key={card._id}>
              {card._title}
              {card.description && <>({card.description})</>}
            </Link>
          )
        })}
      </VisuallyHidden>
    </>
  )
}
