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

const usePostCreateCognitoInvitedUser = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('cognito/users/create', data));
};

const usePostCreateInvitedUser = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('users/create', data));
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
  usePostCreateCognitoInvitedUser,
  usePostCreateInvitedUser,
  usePutUser,
};
