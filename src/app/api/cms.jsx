import { useMutation, useQuery, useQueries } from '@tanstack/react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchCmsIdAnalysis = (listings) => {
  const axios = useAxios();
  const listingIds = listings.map((l) => l.id).sort((a, b) => a - b).join(',');
  return useQuery(['certification=ids', listingIds], async () => {
    const response = await axios.get(`/certification-ids/search?listingIds=${listingIds}`);
    return response.data;
  }, {
    enabled: listings?.length > 0,
  });
};

const useFetchCmsIdPdf = (certId, isDownloading) => {
  const axios = useAxios();
  return useQuery(['certification-ids', certId, 'includeCriteria'], async () => {
    const response = await axios.get(`/certification-ids/${certId}?includeCriteria=true`);
    return response.data;
  }, {
    enabled: !!certId && isDownloading,
  });
};

const useFetchListings = ({ cmsIds }) => {
  const axios = useAxios();
  return useQueries({
    queries: cmsIds.map((cmsId) => ({
      queryKey: ['certification-ids', { cmsId }],
      queryFn: async () => {
        const response = await axios.get(`/certification-ids/${cmsId}`);
        return response.data;
      },
      keepPreviousData: true,
      enabled: cmsIds?.length > 0,
      ...options.daily,
    })),
  });
};

const usePostCreateCmsId = () => {
  const axios = useAxios();
  return useMutation(async ({ idAnalysis }) => axios.post('/certification-ids', {
    listingIds: idAnalysis.products.map((l) => l.productId),
    year: idAnalysis.year,
  }, {
    enabled: idAnalysis?.valid,
  }));
};

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async () => axios.post('certification-ids/report-request', {}));
};

export {
  useFetchCmsIdAnalysis,
  useFetchCmsIdPdf,
  useFetchListings,
  usePostCreateCmsId,
  usePostReportRequest,
};
