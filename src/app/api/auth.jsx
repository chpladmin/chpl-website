import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const usePostChangePassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/change-password', data)
    .then((response) => response.data));
};

const usePostCognitoChangePassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/password', data)
    .then((response) => response.data));
};

const usePostCognitoLogin = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('auth', data)
    .then((response) => response.data), {
    onSuccess: () => {
      queryClient.invalidateQueries('listing');
    },
  });
};

const usePostCognitoLogout = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/logout', data)
    .then((response) => response.data));
};

const usePostEmailResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/email-reset-password', data)
    .then((response) => response?.data));
};

const usePostForgotPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/forgot-password/send-email', data)
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
  return useMutation(async (data) => axios.post('auth/challenge/new-password-required', data)
    .then((response) => response.data));
};

const usePostResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/reset-password-request', data)
    .then((response) => response.data));
};

const usePostSetForgottenPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/forgot-password/set-password', data)
    .then((response) => response?.data));
};

export {
  usePostChangePassword,
  usePostCognitoChangePassword,
  usePostCognitoLogin,
  usePostCognitoLogout,
  usePostEmailResetPassword,
  usePostForgotPassword,
  usePostLogin,
  usePostNewPasswordRequired,
  usePostResetPassword,
  usePostSetForgottenPassword,
};
