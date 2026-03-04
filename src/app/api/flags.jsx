import { useQuery } from '@tanstack/react-query';

import { useAxios } from './axios';

const useFetchEnvironment = () => {
  const axios = useAxios();
  return useQuery(['system-status'], async () => {
    const response = await axios.get('system-status');
    return response;
  });
};

const useFetchFlags = () => {
  const axios = useAxios();
  return useQuery(['feature-flags'], async () => {
    const response = await axios.get('feature-flags');
    return response.data;
  });
};

export {
  useFetchEnvironment,
  useFetchFlags,
};
