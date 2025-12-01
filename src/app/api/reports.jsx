import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchReportMetadata = () => {
  const axios = useAxios();
  return useQuery(['report-metadata'], async () => {
    const response = await axios.get('report-metadata');
    return response.data;
  });
};

export {
  useFetchReportMetadata,
};
