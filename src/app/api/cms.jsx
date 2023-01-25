import { useMutation, useQuery, useQueries } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchCmsIdAnalysis = (listings) => {
  const axios = useAxios();
  const ids = listings.map((l) => l.id).sort((a, b) => a - b).join(',');
  return useQuery(['certification_ids', ids], async () => {
    const response = await axios.get(`/certification_ids/search?ids=${ids}`);
    return response.data;
  }, {
    enabled: listings?.length > 0,
  });
};

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

const usePostCreateCmsId = (listings) => {
  const axios = useAxios();
  const ids = listings.map((l) => l.id).sort((a, b) => a - b).join(',');
  return useMutation(async () => axios.post(`/certification_ids?ids=${ids}`, {}));
};

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async () => axios.post('certification_ids/report-request', {}));
};

export {
  useFetchCmsIdAnalysis,
  useFetchListings,
  usePostCreateCmsId,
  usePostReportRequest,
};
