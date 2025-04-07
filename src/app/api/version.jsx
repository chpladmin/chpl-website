import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const usePostVersionSplit = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`versions/${data.oldVersion.id}/split`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
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
    },
  });
};

export {
  usePostVersionSplit,
  usePutVersion,
};
