import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';

const usePostProductSplit = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`products/${data.oldProduct.id}/split`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/hierarchy');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

const usePutProduct = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('products', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/hierarchy');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

export {
  usePostProductSplit,
  usePutProduct,
};
