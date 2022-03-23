import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchPendingListing = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listings/pending', id], async () => {
    if (id) {
      const response = await axios.get(`/listings/pending/${id}`);
      return response.data;
    }
    return {};
  }, {
    keepPreviousData: true,
  });
};

const useFetchPendingListings = () => {
  const axios = useAxios();
  return useQuery(['listings/pending'], async () => {
    const response = await axios.get('listings/pending');
    return response.data;
  }, {
    refetchInterval: (data) => (data?.filter((l) => l.status === 'UPLOAD_PROCESSING').length > 0) && 1000,
  });
};

const useFetchPendingListingsLegacy = () => {
  const axios = useAxios();
  return useQuery(['certified_products/pending/metadata'], async () => {
    const response = await axios.get('certified_products/pending/metadata');
    return response.data;
  }, {
    refetchInterval: (data) => (data?.filter((l) => l.processing).length > 0) && 1000,
  });
};

const useRejectPendingListing = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (id) => axios.delete(`/listings/pending/${id}`)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('listings/pending');
    },
  });
};

const useRejectPendingListingLegacy = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (id) => axios.delete(`/certified_products/pending/${id}`)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('certified_products/pending/metadata');
    },
  });
};

export {
  useFetchPendingListing,
  useFetchPendingListings,
  useFetchPendingListingsLegacy,
  useRejectPendingListing,
  useRejectPendingListingLegacy,
};
