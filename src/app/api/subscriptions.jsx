import { useMutation, useQuery } from 'react-query';

import { useAxios } from './axios';

const useDeleteSubscriber = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.put('subscriptions/unsubscribe-all', data));
};

const useFetchRoles = () => {
  const axios = useAxios();
  return useQuery(['subscribers/roles'], async () => {
    const response = await axios.get('subscribers/roles');
    return response.data;
  });
};

const useFetchSubscriber = (hash) => {
  const axios = useAxios();
  return useQuery(['subscribers', hash], async () => {
    const response = await axios.get(`subscribers/${hash}`);
    return response.data;
  }, {
    enabled: !!hash,
  });
};

const useFetchSubscriptions = (hash) => {
  const axios = useAxios();
  return useQuery(['subscribers', hash, 'subscriptions'], async () => {
    const response = await axios.get(`subscribers/${hash}/subscriptions`);
    return response.data;
  }, {
    enabled: !!hash,
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
  useFetchSubscriber,
  useFetchSubscriptions,
  usePostSubscription,
  usePutSubscriber,
};
