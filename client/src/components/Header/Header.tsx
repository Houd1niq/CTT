import cn from 'classnames';
import './header.scss'
import {userApiSlice} from "../../services/CTTApi/userApiSlice.ts";
import {authApiSlice} from "../../services/CTTApi/authApiSlice.ts";
import {useAppDispatch} from "../../store/hooks.ts";
import {logOut} from "../../store/slices/authSlice.ts";

type HeaderProps = {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  const {
    className,
  } = props;
  const dispatch = useAppDispatch()


  const {currentData: user} = userApiSlice.useGetMeQuery()

  const [logoutTrigger] = authApiSlice.useLogoutMutation()

  return (
    <header className={cn(className, "headerContainer")}>
      <div className="blueOverlay"></div>
      <img src="/image%204.png" alt="headerImage" className="image"/>
      <div className="transparentOverlay">
        {user && <button onClick={() => {
          logoutTrigger()
          dispatch(logOut())
        }} className="logout">Выйти</button>}
      </div>
      <img src="/image%202.png" alt="headerLogo" className="logo"/>
      <h1 className="title">
        <span>Центр трансфера</span>
        <span>технологий</span>
      </h1>
    </header>
  );
};
