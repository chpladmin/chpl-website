import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useDeleteUserFromAcb = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`acbs/${data.id}/users/${data.userId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['acbs', 'users']);
    },
  });
};

const useFetchAcbs = (editable = false) => {
  const axios = useAxios();
  return useQuery(['acbs', editable], async () => {
    const response = await axios.get(`acbs?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  }, editable ? {} : options.daily);
};

const useFetchUsersAtAcb = (acb, orgType) => {
  const id = acb?.id;
  const axios = useAxios();
  return useQuery(['acbs', 'users', id], async () => {
    const response = await axios.get(`acbs/${id}/users`);
    return response.data;
  }, {
    enabled: !!id && orgType === 'acb',
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

const usePostCognitoUserInvitation = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('cognito/users/invite', data));
};

const usePostUserInvitation = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('users/invite', data));
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
  useDeleteUserFromAcb,
  useFetchAcbs,
  useFetchUsersAtAcb,
  usePostAcb,
  usePostCognitoUserInvitation,
  usePostUserInvitation,
  usePutAcb,
};
