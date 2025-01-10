import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchReportGroupMetadata = (reportGroup) => {
  const axios = useAxios();
  return useQuery(['report-metadata', reportGroup], async () => {
    const response = await axios.get(`report-data/report-metadata/group/${reportGroup}`);
    return response.data;
  }, {
    enabled: !!reportGroup,
  });
};

const useFetchReportMetadata = (report) => {
  const axios = useAxios();
  return useQuery(['report-metadata', report], async () => {
    const response = await axios.get(`report-data/report-metadata/${report}`);
    return response.data;
  }, {
    enabled: !!report,
  });
};

export {
  useFetchReportGroupMetadata,
  useFetchReportMetadata,
};
