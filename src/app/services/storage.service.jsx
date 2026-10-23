import { useState, useEffect } from 'react';

const getValue = (key, defaultValue, storage) => {
  const saved = storage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
};

const useStorage = (key, defaultValue, storage) => {
  const [value, setValue] = useState(() => getValue(key, defaultValue, storage));

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const useSessionStorage = (key, defaultValue) => useStorage(key, defaultValue, sessionStorage);

export { useSessionStorage }; // eslint-disable-line import/prefer-default-export
