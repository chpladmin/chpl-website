import { useState, useEffect } from 'react';

const getValue = (key, defaultValue, storage) => {
  const saved = storage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

const useStorage = (key, defaultValue, storage) => {
  const [value, setValue] = useState(() => getValue(key, defaultValue, storage));

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const useLocalStorage = (key, defaultValue) => {
  return useStorage(key, defaultValue, localStorage);
};

const useSessionStorage = (key, defaultValue) => {
  return useStorage(key, defaultValue, sessionStorage);
};

export { useLocalStorage, useSessionStorage };
