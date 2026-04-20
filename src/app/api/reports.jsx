import { useQuery } from '@tanstack/react-query';

import { useAxios } from './axios';

const useFetchReportMetadata = (reportGroup = 'charts') => {
  const axios = useAxios();
  return useQuery(['report-metadata', reportGroup], async () => {
    const response = await axios.get(`report-metadata/${reportGroup}`);
    return response.data;
  });
};

/* eslint-disable import/prefer-default-export */
export {
  useFetchReportMetadata,
};
