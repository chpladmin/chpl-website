import React, { createContext, useContext, useMemo } from 'react';
import Axios from 'axios';

const AxiosContext = createContext();

function AxiosProvider({children}) {
  const axios = useMemo(() => {
    const axios = Axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    axios.interceptors.request.use((config) => {
      /*
        const token = localStorage.getItem("token");
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
      */
      config.headers['API-Key'] = '12909a978483dfb8ecd0596c98ae9094';

      return config;
    });

    return axios;
  }, []);

  return (
    <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
  );
}

function useAxios() {
  return useContext(AxiosContext);
}

export { AxiosContext, AxiosProvider, useAxios };
