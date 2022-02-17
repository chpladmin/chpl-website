import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchPendingListing = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listings/pending', id], async () => {
    const response = await axios.get(`/listings/pending/${id}`);
    return response.data;
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

const usePostChangeRequest = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('change-requests', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('change-requests');
      queryClient.invalidateQueries({
        predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
      });
    },
    onError: (error) => {
      if (error.response.data.error?.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
        queryClient.invalidateQueries({
          predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
        });
      }
      return error;
    },
  });
};

export {
  useFetchPendingListing,
  useFetchPendingListings,
  useFetchPendingListingsLegacy,
};
