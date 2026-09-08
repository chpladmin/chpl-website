import React, { createContext, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { applyAuthTokenInterceptor, getAccessToken } from 'axios-jwt';
import { element } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';

import { clearSession, SESSION_COOKIES } from 'services/auth.service';
import store from 'store';

const AxiosContext = createContext();

function AxiosProvider({ children }) {
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [, , removeCookie] = useCookies(SESSION_COOKIES);

  const axios = useMemo(() => {
    const ax = Axios.create({
      baseURL: '/rest/',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const requestRefresh = (refreshToken) => {
      const { cognitoId } = store.getState().userInfo.user ?? {};
      const headers = {
        'API-Key': apiKey,
      };
      if (cognitoId) {
        // Notice that this is the global axios instance, not the axiosInstance!  <-- important
        return Axios.post('rest/auth/refresh-token', { refreshToken, cognitoId }, { headers })
          .then((response) => response.data.accessToken)
          .catch(() => {
            clearSession(dispatch, removeCookie);
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
        // Only tear down a session that actually exists; an anonymous visitor
        // hitting this error should not be pushed into the sign-in flow.
        if (error?.response?.data === 'Invalid authentication token.' && store.getState().userInfo.user?.role) {
          clearSession(dispatch, removeCookie);
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
