import { fragmentOn } from '@/.basehub'

export const CardsGridComponent = ({ _title, cards }: CardsGridFragment) => {
  return (
    <div data-type="cards-grid">
      <h2>{_title}</h2>
      <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 ">
        {cards.items.map((card) => (
          <div
            key={card._id}
            className="card rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
          >
            <h3 className="mt-0" style={{ marginTop: 0 }}>
              {card._title}
            </h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
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
