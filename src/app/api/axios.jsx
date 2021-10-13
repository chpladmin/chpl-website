import React, { createContext, useContext, useMemo } from 'react';
import Axios from 'axios';
import { element } from 'prop-types';

const AxiosContext = createContext();

function AxiosProvider({ children }) {
  const axios = useMemo(() => {
    const ax = Axios.create({
      baseURL: '/rest/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    ax.interceptors.request.use((config) => {
      const updated = {
        ...config,
      };
      updated.headers['API-Key'] = '12909a978483dfb8ecd0596c98ae9094';
      const token = localStorage.getItem('ngStorage-jwtToken');
      if (token) {
        updated.headers.Authorization = `Bearer ${token}`;
      }
      return updated;
    });

    return ax;
  }, []);

  return (
    <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
  );
}

AxiosProvider.propTypes = {
  children: element.isRequired,
};

function useAxios() {
  return useContext(AxiosContext);
}

export { AxiosContext, AxiosProvider, useAxios };
