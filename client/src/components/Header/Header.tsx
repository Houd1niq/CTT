import cn from 'classnames';
import './header.scss'

type HeaderProps = {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  const {
    className,
  } = props;
  return (
    <header className={cn(className, "headerContainer")}>
      <div className="blueOverlay"></div>
      <img src="/image%204.png" alt="headerImage" className="image"/>
      <div className="transparentOverlay"></div>
      <img src="/image%202.png" alt="headerLogo" className="logo"/>
      <h1 className="title">
        <span>Центр трансфера</span>
        <span>технологий</span>
      </h1>
    </header>
  );
};
