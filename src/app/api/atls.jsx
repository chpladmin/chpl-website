import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAtls = (editable = false) => {
  const axios = useAxios();
  return useQuery(['atls', editable], async () => {
    const response = await axios.get(`atls?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  }, editable ? {} : options.daily);
};

const usePostAtl = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('atls', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('atls');
    },
  });
};

const usePutAtl = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`atls/${data.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('atls');
    },
  });
};

export {
  useFetchAtls,
  usePostAtl,
  usePutAtl,
};
