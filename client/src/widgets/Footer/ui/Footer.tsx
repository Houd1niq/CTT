import cn from 'classnames';
import './footer.scss'

type FooterProps = {
  className?: string;
}

export const Footer = (props: FooterProps) => {
  const {
    className,
  } = props;
  return (
    <div className={cn(className, "footerContainer")}>
      <footer className="footer">
        <div className="footerContacts">
          <h3 className="footerTitle">Контакты</h3>
          <p>Телефон: +7 (999) 999-99-99</p>
          <p>Почта: 7QDjz@example.com</p>
          <p>Адрес: г. Москва, ул. Московская, д. 1</p>
        </div>
      </footer>
    </div>
  );
};
