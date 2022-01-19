import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestationData = () => {
  const axios = useAxios();
  return useQuery(['attestations'], async () => {
    const response = await axios.get('/attestations/form');
    return response.data;
  }, {
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    keepPreviousData: true,
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAttestationData };
