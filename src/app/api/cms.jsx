import { useMutation, useQueries } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchListings = ({ cmsIds }) => {
  const axios = useAxios();
  return useQueries(
    cmsIds.map((cmsId) => ({
      queryKey: ['certification_ids', { cmsId }],
      queryFn: async () => {
        const response = await axios.get(`/certification_ids/${cmsId}`);
        return response.data;
      },
      keepPreviousData: true,
      enabled: cmsIds?.length > 0,
      ...options.daily,
    })),
  );
};

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async () => axios.post('certification_ids/report-request', {}));
};

export {
  useFetchListings,
  usePostReportRequest,
};
