import { Container } from '@radix-ui/themes'
import s from './footer.module.scss'

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <Container className={s.container} py="9">Footer</Container>
    </footer>
  )
}
