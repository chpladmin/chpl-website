import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';

const useDeleteKey = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (key) => axios.delete(`/key/${key.key}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['api-keys']);
    },
  });
};

const useFetchApiKeys = () => {
  const axios = useAxios();
  return useQuery(['api-keys'], async () => {
    const response = await axios.get('/key');
    return response.data;
  });
};

const usePostConfirmApiKey = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('key/confirm', data));
};

export {
  useDeleteKey,
  useFetchApiKeys,
  usePostConfirmApiKey,
};
