import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchRealWorldTestingCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
}) => {
  const axios = useAxios();
  return useQuery(['realWorldTestingCollection', orderBy, pageNumber, pageSize, sortDescending], async () => {
    const response = await axios.get(`/search/beta?certificationEditions=2015&certificationCriteriaIds=56,57,58,181,182&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchRealWorldTestingCollection };
