import { useMutation, useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchReasons = () => {
  const axios = useAxios();
  return useQuery(['subscriptions/reasons'], async () => {
    const response = await axios.get('subscriptions/reasons');
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
  useFetchReasons,
  usePostSubscription,
  usePutSubscriber,
};
