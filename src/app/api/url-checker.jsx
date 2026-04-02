import { useMutation } from '@tanstack/react-query';

import { useAxios } from './axios';

const usePostUrlChecker = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('urls/validate', data));
};

const usePostRwtResultsChecker = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('real-world-testing/validate-results-url', data));
};

export {
  usePostUrlChecker,
  usePostRwtResultsChecker,
};
