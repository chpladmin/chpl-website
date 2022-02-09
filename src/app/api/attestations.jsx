import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAttestationData = () => {
  const axios = useAxios();
  return useQuery(['attestations'], async () => {
    const response = await axios.get('/attestations/form');
    return response.data;
  }, options.daily);
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAttestationData };
