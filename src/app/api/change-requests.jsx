import { useMutation, useQuery, useQueryClient } from 'react-query';

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
  const queryClient = useQueryClient();
  return useMutation(async (data) => {
    console.log('mutate', data);
    if (data.currentStatus.changeRequestStatusType.name === 'Cancelled by Requester') {
      /*
       * using this construct lets "delete" work as ROLE_DEVELOPER, but doesn't refresh
       */
      axios.put('change-requests', data);
      return {};
    }
    return axios.put('change-requests', data)
      .then((response) => {
        console.log('success');
        return response;
      })
      .catch((error) => {
        console.log('error');
        throw error;
      });
  }, {
    onSuccess: () => {
      console.log('api onsuccess');
      queryClient.invalidateQueries('change-requests');
    },
    onError: (error) => {
      console.log('api onerror');
      if (error.response.data.error.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
      }
      return error;
    },
  });
};

export {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
};
