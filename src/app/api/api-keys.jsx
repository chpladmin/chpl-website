import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchApiKeys = () => {
  const axios = useAxios();
  return useQuery(['api-keys'], async () => {
    const response = await axios.get('/key');
    return response.data;
  });
};

const useDeleteKey = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (key) => axios.delete(`/key/${key.key}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['api-keys']);
    },
  });
};

export {
  useFetchApiKeys,
  useDeleteKey,
};
