import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchSedAgeRanges = () => {
  const axios = useAxios();
  return useQuery(['data/age_ranges'], async () => {
    const response = await axios.get('data/age_ranges');
    return response.data;
  });
};

const useFetchSedEducation = () => {
  const axios = useAxios();
  return useQuery(['data/education_types'], async () => {
    const response = await axios.get('data/education_types');
    return response.data;
  });
};

export {
  useFetchSedAgeRanges,
  useFetchSedEducation,
};
