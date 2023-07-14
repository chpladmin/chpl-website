import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const usePostChangePassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/change-password', data)
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
  return useMutation(async (data) => axios.post('auth/authenticate', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('listing');
    },
  });
};

const usePostResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/reset-password-request', data)
    .then((response) => response.data));
};

export {
  usePostChangePassword,
  usePostEmailResetPassword,
  usePostLogin,
  usePostResetPassword,
};
