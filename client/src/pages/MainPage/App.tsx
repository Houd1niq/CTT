import {useEffect, useState, useRef} from 'react';
import './App.scss';
import {PatentContainer} from "../../components/Patents/PatentsContainer/PatentContainer.tsx";
import {TechnologyFieldFilter} from "../../components/Filters/TechnologyFieldFilter/TechnologyFieldFilter.tsx";
import {PatentTypeFilter} from "../../components/Filters/PatentTypeFilter/PatentTypeFilter.tsx";
import {SortContainer} from "../../components/SortContainer/SortContainer.tsx";
import {SearchField} from "../../components/SearchField/SearchField.tsx";
import {AddPatentModal} from "../../components/Modals/AddPatentModal/AddPatentModal.tsx";
import {Pagination} from "../../components/Pagination/Pagination.tsx";
import {Header} from "../../components/Header/Header.tsx";
import {Footer} from "../../components/Footer/Footer.tsx";

function App() {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
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
      <Header/>

      <div className="contentContainer">
        <div className="filterContainer">
          <div className="filterHeading">Фильтрация!!</div>
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
            <button className="button addButton" onClick={handleAddButtonClick}>
              Добавить
            </button>
          </div>

          <PatentContainer/>
        </div>
      </div>

      <Pagination/>

      <Footer/>

      <AddPatentModal onClose={() => setIsAddPopupOpen(false)} visible={isAddPopupOpen}/>
    </div>
  );
}

export default App;
