import { useMutation } from 'react-query';

import { useAxios } from './axios';

const usePostChangePassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/change-password', data)
    .then((response) => response.data));
};

const usePostEmailResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/email-reset-password', data)
    .then((response) => response));
};

const usePostResetPassword = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('auth/reset-password-request', data)
    .then((response) => response));
};

export {
  usePostChangePassword,
  usePostEmailResetPassword,
  usePostResetPassword,
};
