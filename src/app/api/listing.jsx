import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useDeleteSurveillance = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`certified_products/${data.listingId}/surveillance/${data.id}`, { data: { reason: data.reason } }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['listing']);
    },
  });
};

const useFetchIcsFamilyData = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listing/ics-relationships', id], async () => {
    if (id) {
      const response = await axios.get(`certified_products/${id}/ics-relationships`);
      return response.data;
    }
    return {};
  }, {
    keepPreviousData: true,
  });
};

const useFetchListing = ({ id, fetched = false, enabled = true }) => {
  const axios = useAxios();
  return useQuery(['listing', id], async () => {
    if (id) {
      const response = await axios.get(`certified_products/${id}/details`);
      return response.data;
    }
    return {};
  }, fetched ? options.daily : {
    enabled: !!id && enabled,
  });
};

const useFetchRelatedListings = ({ id }) => {
  const axios = useAxios();
  return useQuery(['relatedListings', id], async () => {
    if (id) {
      const response = await axios.get(`products/${id}/listings`);
      return response.data;
    }
    return {};
  });
};

const usePostSurveillance = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`certified_products/${data.listingId}/surveillance`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['listing']);
    },
  });
};

const usePutListing = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`certified_products/${data.listing.id}`, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(['listing', `${response.data.id}`]);
    },
  });
};

const usePutSurveillance = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`certified_products/${data.listingId}/surveillance/${data.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['listing']);
    },
  });
};

export {
  useDeleteSurveillance,
  useFetchIcsFamilyData,
  useFetchListing,
  useFetchRelatedListings,
  usePostSurveillance,
  usePutListing,
  usePutSurveillance,
};
