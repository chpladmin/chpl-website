import { useMutation } from '@tanstack/react-query';

import { useAxios } from './axios';

const usePostUrlChecker = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('urls/validate', data));
};

/* eslint-disable import/prefer-default-export */
export {
  usePostUrlChecker,
};
