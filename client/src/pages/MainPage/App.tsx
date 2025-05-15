import {useEffect, useState, useRef} from 'react';
import './App.scss';
import {PatentContainer} from "@widgets/PatentsContainer/ui/PatentContainer.tsx";
import {TechnologyFieldFilter} from "@features/patentSearch/ui/TechnologyFieldFilter/TechnologyFieldFilter.tsx";
import {PatentTypeFilter} from "@features/patentSearch/ui/PatentTypeFilter/PatentTypeFilter.tsx";
import {SortContainer} from "@features/patentSearch/ui/SortContainer/SortContainer.tsx";
import {SearchField} from "@features/patentSearch/ui/SearchField/SearchField.tsx";
import {AddPatentModal} from "@features/patentManagement/ui/AddPatentModal/AddPatentModal.tsx";
import {Pagination} from "@features/patentSearch/ui/Pagination/Pagination.tsx";
import {Header} from "@widgets/Header/ui/Header.tsx";
import {Footer} from "@widgets/Footer/ui/Footer.tsx";
import {userApiSlice} from "@entities/user/api/userApiSlice.ts";
import {Button} from "@shared/ui/Button/Button.tsx";
import {InstituteFilter} from "@features/patentSearch";

function App() {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {data: user} = userApiSlice.useGetMeQuery();

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
          <div className="filterHeading">Фильтрация</div>
          <PatentTypeFilter/>
          <TechnologyFieldFilter/>
          <InstituteFilter/>
        </div>

        <div className="mainContainer">
          <div className="moreSortContainer">
            {/*Фильтры на мобилке*/}
            <div className="filterButtonPopup">
              <button className="filterButton" onClick={toggleFilters}>
                <span className="hamburgerIcon">☰</span>
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
            {user && <Button className="addButton" onClick={handleAddButtonClick}>
              Добавить
            </Button>}
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
