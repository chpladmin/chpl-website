import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

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

const useFetchListing = ({ id }) => {
  const axios = useAxios();
  return useQuery(['listing', id], async () => {
    if (id) {
      const response = await axios.get(`certified_products/${id}/details`);
      return response.data;
    }
    return {};
  });
};

const usePutListing = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`certified_products/${data.listing.id}`, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(['listing', response.id]);
    },
  });
};

export {
  useFetchIcsFamilyData,
  useFetchListing,
  usePutListing,
};
