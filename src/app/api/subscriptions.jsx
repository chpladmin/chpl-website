import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteObjectSubscription = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`subscribers/${data.hash}/subscriptions?subscribedObjectTypeId=${data.objectTypeId}&subscribedObjectId=${data.objectId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
    },
  });
};

const useDeleteSubscriber = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.delete(`subscribers/${data.hash}`));
};

const useDeleteSubscription = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`subscribers/${data.hash}/subscriptions/${data.subscriptionId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
    },
  });
};

const useFetchAllSubscriptions = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['subscriptions/search', {
    orderBy, pageNumber, pageSize, sortDescending, query,
  }], async () => {
    const response = await axios.get(`/subscriptions/search?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
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
  useDeleteObjectSubscription,
  useDeleteSubscriber,
  useDeleteSubscription,
  useFetchAllSubscriptions,
  useFetchRoles,
  useFetchSubscriber,
  useFetchSubscriptions,
  usePostSubscription,
  usePutSubscriber,
};
