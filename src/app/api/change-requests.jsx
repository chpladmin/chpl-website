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
  const queryClient = useQueryClient()
  return useMutation(async (data) => {
    try {
      return await axios.put('change-requests', data)
        .then((response) => response)
        .catch((error) => {
          console.log('error-put', error, error.response);
          throw error;
        });
    } catch (error) {
      console.log('caught error', error, error.response.data.error);
      throw error;
    }
  }, {
    onSuccess: () => {
      console.log('invalidate');
      queryClient.invalidateQueries('change-requests');
    },
    onError: (error, variables, context) => {
      console.log('error-api', error.response.data);
      return error;
    },
  });
};

export {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
};
