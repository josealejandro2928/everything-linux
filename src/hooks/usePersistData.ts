import { useEffect } from 'react';

const usePersistData = (selector: Function | any, options: { key: string }) => {
  useEffect(() => {
    localStorage.setItem(options.key, JSON.stringify(selector));
  }, [selector]);
  return selector;
};

export default usePersistData;
