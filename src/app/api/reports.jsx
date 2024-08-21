import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchReportUrl = (reportName) => {
  const axios = useAxios();
  return useQuery(['report-url', reportName], async () => {
    if (reportName) {
      const response = await axios.get(`report-data/${reportName}/url`);
      console.log('reports.jsx');
      console.log(response.data);
      return response.data;
    }
    return {};
  }, {
    enabled: !!reportName,
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchReportUrl };
