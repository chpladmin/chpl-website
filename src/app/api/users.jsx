import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchInvitationType = ({ hash }) => {
  const axios = useAxios();
  return useQuery(['invitation', hash], async () => {
    if (hash) {
      const response = await axios.get(`users/invitation/${hash}`);
      return response.data;
    }
    return '';
  });
};

const usePutUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`users/${data.userId}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['acbs', 'users']);
    },
  });
};

export {
  useFetchInvitationType,
  usePutUser,
};
