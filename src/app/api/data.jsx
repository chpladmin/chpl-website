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

const useFetchCqms = () => {
  const axios = useAxios();
  return useQuery(['data/search-options/'], async () => {
    const response = await axios.get('data/search-options');
    return response.data.cqms;
  }, options.daily);
};

export {
  useFetchComplainantTypes,
  useFetchCqms,
};
