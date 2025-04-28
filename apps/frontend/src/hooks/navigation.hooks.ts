import { useState, useCallback, useEffect } from "react";

export const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash);
  }, [setHash]);

  const clearHash = useCallback(() => {
    if (window.location.hash && "pushState" in window.history) {
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
      setHash("");
    }
  }, [setHash]);

  useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, []);

  const updateHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash) window.location.hash = newHash;
    },
    [hash]
  );

  return {
    hash,
    setHash: updateHash,
    clearHash,
  };
};
