import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAcbs = (editable = false) => {
  const axios = useAxios();
  return useQuery(['acbs', editable], async () => {
    const response = await axios.get(`acbs?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  }, options.daily);
};

const useFetchUsersAtAcb = ({ id }) => {
  const axios = useAxios();
  return useQuery(['acbs', 'users', id], async () => {
    const response = await axios.get(`acbs/${id}/users`);
    return response.data;
  }, {
    enabled: !!id,
  });
};

const usePostAcb = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('acbs', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('acbs');
    },
  });
};

const usePutAcb = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`acbs/${data.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('acbs');
    },
  });
};

export {
  useFetchAcbs,
  useFetchUsersAtAcb,
  usePostAcb,
  usePutAcb,
};
