import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';

const useFetchVersionsByProduct = ({ id }) => {
  const axios = useAxios();
  return useQuery([`/versions?productId=${id}`], async () => {
    const response = await axios.get(`/versions?productId=${id}`);
    return response.data;
  }, {
    enabled: !!id,
  });
};

const usePostVersionSplit = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`versions/${data.oldVersion.id}/split`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/hierarchy');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

const usePutVersion = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('versions', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/hierarchy');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

export {
  useFetchVersionsByProduct,
  usePostVersionSplit,
  usePutVersion,
};
