import { useMutation, useQuery } from 'react-query';

import { useAxios } from './axios';

const useDeleteSubscriber = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.put('subscriptions/unsubscribe-all', data));
};

const useFetchRoles = () => {
  const axios = useAxios();
  return useQuery(['subscriptions/roles'], async () => {
    const response = await axios.get('subscriptions/roles');
    return response.data;
  });
};

const usePostSubscription = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('subscriptions', data));
};

const usePutSubscriber = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.put('subscriptions/confirm-subscriber', data));
};

export {
  useDeleteSubscriber,
  useFetchRoles,
  usePostSubscription,
  usePutSubscriber,
};
