import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

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
      queryClient.invalidateQueries(['acbs', 'users']);
    },
  });
};

export {
  usePostAuthorizeUser,
  usePostCreateInvitation,
  usePostCreateInvitedUser,
  usePutUser,
};
