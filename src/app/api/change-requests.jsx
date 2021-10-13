import { useMutation, useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchChangeRequests = () => {
  const axios = useAxios();
  return useQuery(['change-requests'], async () => {
    const response = await axios.get('change-requests');
    return response.data;
  });
};

const useFetchChangeRequestStatusTypes = () => {
  const axios = useAxios();
  return useQuery(['change-request-status-types'], async () => {
    const response = await axios.get('data/change-request-status-types');
    return response.data;
  });
};

const usePutChangeRequest = () => {
  const axios = useAxios();
  return useMutation(async (data) => {
    return await axios.put('change-requests', data);
  });
};

export {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
};
