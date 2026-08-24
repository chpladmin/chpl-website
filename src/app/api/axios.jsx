import React, { createContext, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { applyAuthTokenInterceptor, clearAuthTokens, getAccessToken } from 'axios-jwt';
import { element } from 'prop-types';
import { useSnackbar } from 'notistack';

import { setLoginState, setUser } from 'components/login/userInfo.slice';

const AxiosContext = createContext();

function AxiosProvider({ children }) {
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const dispatch = useDispatch();
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
        'API-Key': apiKey,
      };
      if (cognitoId) {
        // Notice that this is the global axios instance, not the axiosInstance!  <-- important
        return Axios.post('rest/auth/refresh-token', { refreshToken, cognitoId }, { headers })
          .then((response) => response.data.accessToken)
          .catch(() => {
            dispatch(setLoginState('SIGNIN'));
            dispatch(setUser({}));
            clearAuthTokens();
            localStorage.removeItem('ngStorage-currentUser');
            document.cookie = 'refresh_token=; Max-Age=0; path=/; domain=.healthit.gov;expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
      updated.headers['API-Key'] = apiKey;
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
        if (error?.response?.data === 'Invalid authentication token.') {
          dispatch(setLoginState('SIGNIN'));
          dispatch(setUser({}));
          clearAuthTokens();
          localStorage.removeItem('ngStorage-currentUser');
          document.cookie = 'refresh_token=; Max-Age=0; path=/; domain=.healthit.gov;expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
