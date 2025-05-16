import cn from 'classnames';
import './header.scss'
import {userApiSlice} from "@entities/user/api/userApiSlice.ts";
import {authApiSlice} from "@features/auth/model/authApiSlice.ts";
import {useAppDispatch, useIsAdmin} from "@shared/utils/hooks.ts";
import {logOut} from "@features/auth/model/authSlice.ts";
import {Link} from "react-router-dom";

type HeaderProps = {
  className?: string;
}

export const Header = (props: HeaderProps) => {
  const {
    className,
  } = props;
  const dispatch = useAppDispatch()


  const {currentData: user} = userApiSlice.useGetMeQuery()
  const isAdmin = useIsAdmin()

  const [logoutTrigger] = authApiSlice.useLogoutMutation()

  return (
    <header className={cn(className, "headerContainer")}>
      <div className="blueOverlay"></div>
      <img src="/image%204.png" alt="headerImage" className="image"/>
      <div className="transparentOverlay">
        {isAdmin && <Link className="logout" to="/admin">Панель администратора</Link>}
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
