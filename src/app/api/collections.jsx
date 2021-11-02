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
  return useQuery(['realWorldTestingCollection', orderBy, pageNumber, pageSize, sortDescending, query], async () => {
    const response = await axios.get(`/search/beta?rwtOptions=is_eligible,has_plans_url,has_results_url&${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchRealWorldTestingCollection };
