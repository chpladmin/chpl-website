import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchApiDocumentationCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['search/beta?certificationCriteriaIds=56,57,58,181,182', orderBy, pageNumber, pageSize, sortDescending, query], async () => {
    const response = await axios.get(`/search/beta?${query}&certificationCriteriaIds=56,57,58,181,182&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchRealWorldTestingCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['search/beta?rwtOptions=has_plans_url,has_results_url', orderBy, pageNumber, pageSize, sortDescending, query], async () => {
    const response = await axios.get(`/search/beta?${query}&rwtOptions=has_plans_url,has_results_url&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

export {
  useFetchApiDocumentationCollection,
  useFetchRealWorldTestingCollection,
};
