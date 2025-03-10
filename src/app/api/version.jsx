import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

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
  usePutVersion,
};
