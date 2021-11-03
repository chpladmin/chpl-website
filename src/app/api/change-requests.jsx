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
    axios.put('change-requests', data) // using this line lets "delete" work as ROLE_DEVELOPER, but doesn't refresh anything
    // return axios.put('change-requests', data) // using line has "delete" as ROLE_DEVELOPER hang, but refreshes on all the other actions
      .then((response) => {
        console.log('success');
        return response;
      })
      .catch((error) => {
        console.log('error');
        throw error;
      })
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
