import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

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
  return useMutation(async (data) => axios.put(`cognito/users/${data.cognitoId}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['acbs', 'users']);
    },
  });
};

export {
  usePutUser, // eslint-disable-line import/prefer-default-export
  usePutCognitoUser, // eslint-disable-line import/prefer-default-export
};
