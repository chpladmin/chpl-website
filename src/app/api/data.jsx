import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchComplainantTypes = () => {
  const axios = useAxios();
  return useQuery(['data/complainant-types/'], async () => {
    const response = await axios.get('data/complainant-types');
    return response.data;
  }, options.daily);
};

const useFetchCriteria = () => {
  const axios = useAxios();
  return useQuery(['data/certification-criteria/'], async () => {
    const response = await axios.get('data/certification-criteria');
    return response.data;
  }, options.daily);
};

export {
  useFetchComplainantTypes,
  useFetchCriteria,
};
