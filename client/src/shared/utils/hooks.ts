import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@app/store/store.ts";
import {useEffect} from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


export const useModalOverflow = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflowY = 'hidden';
      document.body.style.paddingRight = scrollWidth + 'px';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.paddingRight = '0px';
    }
  }, [isOpen]);
}
