import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchRealWorldTestingCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['search/v2?rwtOptions=has_plans_url,has_results_url', orderBy, pageNumber, pageSize, sortDescending, query], async () => {
    const response = await axios.get(`/search/v2?${query}&rwtOptions=has_plans_url,has_results_url&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchRealWorldTestingCollection };
