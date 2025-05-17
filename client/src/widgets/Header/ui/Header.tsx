import cn from 'classnames';
import './header.scss'
import {userApiSlice} from "@entities/user/api/userApiSlice.ts";
import {authApiSlice} from "@features/auth/model/authApiSlice.ts";
import {useAppDispatch, useIsAdmin} from "@shared/utils/hooks.ts";
import {logOut} from "@features/auth/model/authSlice.ts";
import {Link} from "react-router-dom";
import axios from "axios";
import {useNotification} from "@shared/model/notification/notification-hooks.ts";

type HeaderProps = {
  className?: string;
}

let baseUrl = window.location.origin;

if (import.meta.env.DEV) {
  baseUrl = "http://localhost:5000";
}

export const Header = (props: HeaderProps) => {
  const {
    className,
  } = props;
  const dispatch = useAppDispatch()


  const {currentData: user} = userApiSlice.useGetMeQuery()
  const isAdmin = useIsAdmin()

  const [logoutTrigger] = authApiSlice.useLogoutMutation()
  const {setNotification} = useNotification()

  const getReport = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      try {
        const response = await axios({
          method: 'get',
          url: baseUrl + '/patent/report',
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Patents_report.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.log(e)
        setNotification({
          message: 'Произошла ошибка, попробуйте обновить страницу',
          type: 'error'
        })
      }
    }
  }

  return (
    <header className={cn(className, "headerContainer")}>
      <div className="blueOverlay"></div>
      <img src="/image%204.png" alt="headerImage" className="image"/>
      <div className="transparentOverlay">
        {isAdmin && <button onClick={() => getReport()} className="logout">Отчет</button>}
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
