import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchListings = ({ cmsId }) => {
  const axios = useAxios();
  return useQuery(['certification_ids', { cmsId }], async () => {
    const response = await axios.get(`/certification_ids/${cmsId}`);
    return response.data;
  }, { keepPreviousData: true });
};

export {
  useFetchListings,
};
