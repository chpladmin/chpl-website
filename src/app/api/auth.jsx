import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const usePostChangePassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/change-password', data)
    .then((response) => response.data));
};

const usePostCognitoLogin = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('cognito/users/authenticate', data)
    .then((response) => response.data), {
    onSuccess: () => {
      queryClient.invalidateQueries('listing');
    },
  });
};

const usePostCognitoLogout = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('cognito/users/logout', data)
    .then((response) => response.data));
};

const usePostEmailResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/email-reset-password', data)
    .then((response) => response?.data));
};

const usePostLogin = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('auth/authenticate', data)
    .then((response) => response.data), {
    onSuccess: () => {
      queryClient.invalidateQueries('listing');
    },
  });
};

const usePostNewPasswordRequired = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('cognito/users/authenticate/challenge/new-password-required', data)
    .then((response) => response.data));
};

const usePostResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/reset-password-request', data)
    .then((response) => response.data));
};

export {
  usePostChangePassword,
  usePostCognitoLogin,
  usePostCognitoLogout,
  usePostEmailResetPassword,
  usePostLogin,
  usePostNewPasswordRequired,
  usePostResetPassword,
};
