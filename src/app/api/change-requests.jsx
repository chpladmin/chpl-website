import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchChangeRequest = ({ id }) => {
  const axios = useAxios();
  return useQuery(['change-requests', id], async () => {
    if (id) {
      const response = await axios.get(`change-requests/${id}`);
      return response.data;
    }
    return {};
  }, {
    keepPreviousData: true,
  });
};

const useFetchChangeRequests = ({
  orderBy = 'current_status_change_date_time',
  pageNumber,
  pageSize,
  sortDescending = false,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['change-requests/search/v2', {
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query,
  }], async () => {
    const response = await axios.get(`change-requests/search/v2?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchChangeRequestStatusTypes = () => {
  const axios = useAxios();
  return useQuery(['change-request-status-types'], async () => {
    const response = await axios.get('data/change-request-status-types');
    return response.data;
  }, options.daily);
};

const useFetchChangeRequestTypes = () => {
  const axios = useAxios();
  return useQuery(['change-request-types'], async () => {
    const response = await axios.get('data/change-request-types');
    return response.data;
  }, options.daily);
};

const usePostChangeRequest = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('change-requests', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('change-requests');
      queryClient.invalidateQueries('change-requests/search/v2');
      queryClient.invalidateQueries('developers/attestations');
    },
    onError: (error) => {
      if (error.response.data.error?.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
        queryClient.invalidateQueries('change-requests/search/v2');
        queryClient.invalidateQueries('developers/attestations');
      }
      return error;
    },
  });
};

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('change-requests/report-request', data));
};

const usePutChangeRequest = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('change-requests', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('change-requests');
      queryClient.invalidateQueries('change-requests/search/v2');
      queryClient.invalidateQueries('developers/attestations');
    },
    onError: (error) => {
      if (error.response.data.error?.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
        queryClient.invalidateQueries('change-requests/search/v2');
        queryClient.invalidateQueries('developers/attestations');
      }
      return error;
    },
  });
};

export {
  useFetchChangeRequest,
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  useFetchChangeRequestTypes,
  usePostChangeRequest,
  usePostReportRequest,
  usePutChangeRequest,
};
