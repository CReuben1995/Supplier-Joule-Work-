import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "spacesListOpen";

const readStoredOpen = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(STORAGE_KEY) === "true";
};

const storeOpen = (open: boolean) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, String(open));
};

export const useSpacesListOpen = () => {
  const location = useLocation();
  const [listOpen, setListOpenState] = useState(() => location.state?.spacesListOpen === true || readStoredOpen());

  useEffect(() => {
    if (location.state?.spacesListOpen === true) {
      setListOpenState(true);
      storeOpen(true);
    }
  }, [location.state]);

  const setListOpen = useCallback((value: boolean | ((open: boolean) => boolean)) => {
    setListOpenState((current) => {
      const next = typeof value === "function" ? value(current) : value;
      storeOpen(next);
      return next;
    });
  }, []);

  return [listOpen, setListOpen] as const;
};
