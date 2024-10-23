import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const usePostCreateCognitoInvitedUser = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('users', data));
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

const usePutCognitoUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`users/${data.cognitoId}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['acbs', 'users']);
    },
  });
};

export {
  usePostCreateCognitoInvitedUser,
  usePostCreateInvitedUser,
  usePutCognitoUser,
  usePutUser,
};
