import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestationData = () => {
  const axios = useAxios();
  return useQuery(['attestations'], async () => {
    const response = await axios.get('/attestations');
    return response.data;
  }, { keepPreviousData: true });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAttestationData };
