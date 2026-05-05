import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAxios } from './axios';

const useFetchUsers = () => {
  const axios = useAxios();
  return useQuery(['users'], async () => {
    const response = await axios.get('users');
    return response.data;
  });
};

const usePostAuthorizeUser = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post(`users/authorize/${data}`, {}));
};

const usePostCreateInvitation = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('users/invitation', data));
};

const usePostCreateInvitedUser = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('users', data));
};

const usePutUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`users/${data.cognitoId}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['acbs', 'users']);
      queryClient.invalidateQueries(['developers', 'users']);
    },
  });
};

export {
  useFetchUsers,
  usePostAuthorizeUser,
  usePostCreateInvitation,
  usePostCreateInvitedUser,
  usePutUser,
};
