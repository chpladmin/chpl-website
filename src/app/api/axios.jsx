import React, { createContext, useContext, useMemo } from 'react';
import Axios from 'axios';
import {
  applyAuthTokenInterceptor,
  getAccessToken,
}
  from 'axios-jwt';
import { element } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';

const AxiosContext = createContext();

function AxiosProvider({ children }) {
  const $localStorage = getAngularService('$localStorage');
  const authService = getAngularService('authService');

  const axios = useMemo(() => {
    const ax = Axios.create({
      baseURL: '/rest/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const requestRefresh = (refreshToken) => {
      const user = JSON.parse(localStorage.getItem('ngStorage-currentUser'));
      const { cognitoId } = user;
      const headers = {
        'API-Key': '12909a978483dfb8ecd0596c98ae9094',
      };
      if (cognitoId) {
        // Notice that this is the global axios instance, not the axiosInstance!  <-- important
        return Axios.post('auth/refresh-token', { refreshToken, cognitoId }, { headers })
          .then((response) => {
            $localStorage.jwtToken = response.data.accessToken;
            return response.data.accessToken;
          })
          .catch(() => {
            authService.logout();
          });
      }
      return new Promise((resolve) => resolve(''));
    };

    // Notice that this uses the axiosInstance instance.  <-- important
    applyAuthTokenInterceptor(ax, { requestRefresh });

    ax.interceptors.request.use(async (config) => {
      const updated = {
        ...config,
      };
      updated.headers['API-Key'] = '12909a978483dfb8ecd0596c98ae9094';
      let accessToken = '';
      if (JSON.parse(localStorage.getItem('ngStorage-currentUser'))?.cognitoId) {
        accessToken = await getAccessToken();
      } else if (JSON.parse(localStorage.getItem('ngStorage-currentUser'))?.userId) {
        accessToken = $localStorage.jwtToken;
      }
      if (accessToken) {
        updated.headers.Authorization = `Bearer ${accessToken}`;
      }
      return updated;
    });

    ax.interceptors.response.use((response) => response,
      (error) => {
        if (error.response.data && error.response.data === 'Invalid authentication token.' && authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
          authService.logout();
        }
        return Promise.reject(error);
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
