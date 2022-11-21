import { useMutation, useQueries } from 'react-query';

import { useAxios } from './axios';

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
