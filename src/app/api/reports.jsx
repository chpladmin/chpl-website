import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchReportMetadata = (reportGroup) => {
  const axios = useAxios();
  return useQuery(['report-metadata', reportGroup], async () => {
    const response = await axios.get(`report-data/report-metadata/group/${reportGroup}`);
    return response.data;
  }, {
    enabled: !!reportGroup,
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchReportMetadata };
