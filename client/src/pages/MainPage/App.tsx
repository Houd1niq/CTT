import React, {useEffect, useState, useRef} from 'react';
import './App.scss';
import {PatentContainer} from "../../components/Patents/PatentsContainer/PatentContainer.tsx";
import {TechnologyFieldFilter} from "../../components/Filter/TechnologyFieldFilter.tsx";
import {PatentTypeFilter} from "../../components/Filter/PatentTypeFilter.tsx";
import {SortContainer} from "../../components/SortContainer/SortContainer.tsx";
import {SearchField} from "../../components/SearchField/SearchField.tsx";
import {AddPatentModal} from "../../components/Modals/AddPatentModal/AddPatentModal.tsx";
import {Pagination} from "../../components/Pagination/Pagination.tsx";

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
                                                     message,
                                                     type,
                                                     onClose,
                                                   }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};


function App() {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [showFilters, setShowFilters] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const toggleFilters = () => setShowFilters(prev => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      popupRef.current &&
      !popupRef.current.contains(target) &&
      !target.closest('.filterButton')
    ) {
      setShowFilters(false);
    }
  };

  useEffect(() => {
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);


  // const showNotification = (message: string, type: 'success' | 'error') => {
  //   setNotification({message, type});
  // };

  const handleAddButtonClick = () => {
    setIsAddPopupOpen(true);
  };


  //todo Адаптировать

  // useEffect(() => {
  //   const allPopups = isAddPopupOpen || isDeletePopupOpen;
  //   if (allPopups) {
  //     const scrollWidth =
  //       window.innerWidth - document.documentElement.clientWidth;
  //     document.body.style.overflowY = 'hidden';
  //     document.body.style.paddingRight = scrollWidth + 'px';
  //   } else {
  //     document.body.style.overflowY = 'auto';
  //     document.body.style.paddingRight = '0px';
  //   }
  // }, [isAddPopupOpen, isDeletePopupOpen]);

  return (
    <div className="firstContainer">

      <header className="headerContainer">
        <div className="blueOverlay"></div>
        <img src="/image%204.png" alt="headerImage" className="image"/>
        <div className="transparentOverlay"></div>
        <img src="/image%202.png" alt="headerLogo" className="logo"/>
        <h1 className="title">
          <span className="line1">Центр трансфера</span>
          <span className="line2">технологий</span>
        </h1>
      </header>

      <div className="contentContainer">

        <div className="filterContainer">
          <div className="filterHeading">Фильтрация</div>
          <PatentTypeFilter/>
          <TechnologyFieldFilter/>
        </div>

        <div className="mainContainer">
          <div className="moreSortContainer">
            {/*Фильтры на мобилке*/}
            <div className="filterButtonPopup">
              <button className="filterButton" onClick={toggleFilters}>
                <span className="hamburgerIcon">☰</span> Фильтрация
              </button>
              {showFilters && (
                <div ref={popupRef} className="popupContainerFilter">
                  <PatentTypeFilter/>
                  <TechnologyFieldFilter/>
                </div>
              )}
            </div>

            <SearchField/>
            <SortContainer/>
            <button className="addButton" onClick={handleAddButtonClick}>
              Добавить
            </button>
          </div>

          <PatentContainer/>
        </div>
      </div>

      <Pagination/>

      <div className="footerContainer">
        <footer className="footer">
          <h3 className="footerTitle">Контакты</h3>
          <div className="footerContacts">
          </div>
        </footer>
      </div>

      <AddPatentModal onClose={() => setIsAddPopupOpen(false)} visible={isAddPopupOpen}/>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
