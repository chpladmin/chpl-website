import React, { createContext, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { applyAuthTokenInterceptor, getAccessToken } from 'axios-jwt';
import { element } from 'prop-types';
import { useSnackbar } from 'notistack';

import { setLoginState } from 'components/login/userInfo.slice';
import { getAngularService } from 'services/angular-react-helper';

const AxiosContext = createContext();

function AxiosProvider({ children }) {
  const dispatch = useDispatch();
  const authService = getAngularService('authService');
  const { enqueueSnackbar } = useSnackbar();

  const axios = useMemo(() => {
    const ax = Axios.create({
      baseURL: '/rest/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const requestRefresh = (refreshToken) => {
      const { cognitoId } = JSON.parse(localStorage.getItem('ngStorage-currentUser'));
      const headers = {
        'API-Key': '12909a978483dfb8ecd0596c98ae9094',
      };
      if (cognitoId) {
        // Notice that this is the global axios instance, not the axiosInstance!  <-- important
        return Axios.post('rest/auth/refresh-token', { refreshToken, cognitoId }, { headers })
          .then((response) => response.data.accessToken)
          .catch(() => {
            dispatch(setLoginState('SIGNIN'));
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
      accessToken = await getAccessToken();
      if (accessToken) {
        updated.headers.Authorization = `Bearer ${accessToken}`;
      }
      return updated;
    });

    ax.interceptors.response.use(
      (response) => {
        if (response.headers['chpl-id-changed']) {
          if (response.headers['chpl-id-changed'].indexOf(',') > 1) {
            enqueueSnackbar('CHPL IDs Changed. Your activity caused CHPL Product Numbers to change', {
              variant: 'success',
            });
          } else {
            enqueueSnackbar('CHPL ID Changed. Your activity caused a CHPL Product Number to change', {
              variant: 'success',
            });
          }
        }
        if (response.headers['cache-cleared']) {
          enqueueSnackbar('Update processing. Your changes may not be reflected immediately in the search results and shortcuts pages. Please contact CHPL admin if you have any concerns', {
            variant: 'warning',
          });
        }
        return response;
      },
      (error) => {
        if (error?.response?.data === 'Invalid authentication token.' && authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
          dispatch(setLoginState('SIGNIN'));
          authService.logout();
        }
        return Promise.reject(error);
      },
    );

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
