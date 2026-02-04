import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';
import options from './options';

const useConfirmPendingListing = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`/listings/pending/${data.listing.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['listings/pending']);
    },
    onError: () => {
      queryClient.invalidateQueries(['listings/pending']);
    },
  });
};

const useFetchPendingListing = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listings/pending', id], async () => {
    if (id) {
      const response = await axios.get(`/listings/pending/${id}`);
      return response.data;
    }
    return {};
  }, options.daily);
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

const useFetchUploadedDeveloper = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listings/pending/submitted', id], async () => {
    if (id) {
      const response = await axios.get(`/listings/pending/${id}/submitted`);
      return response.data.developer;
    }
    return {};
  }, {
    keepPreviousData: true,
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

export {
  useConfirmPendingListing,
  useFetchPendingListing,
  useFetchPendingListings,
  useFetchUploadedDeveloper,
  useRejectPendingListing,
};
