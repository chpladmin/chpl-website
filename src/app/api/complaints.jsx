import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`complaints/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints/search/v2');
    },
  });
};

const useFetchComplaints = ({
  orderBy = 'received_date',
  pageNumber,
  pageSize,
  sortDescending = false,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['complaints/search/v2', {
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query,
  }], async () => {
    const response = await axios.get(`complaints/search/v2?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const usePostComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('complaints', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints/search/v2');
    },
  });
};

const usePostReportRequest = () => {
  const axios = useAxios();
  return useMutation(async () => axios.post('complaints/report-request', {}));
};

const usePutComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`complaints/${data.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints/search/v2');
    },
  });
};

export {
  useDeleteComplaint,
  useFetchComplaints,
  usePostComplaint,
  usePostReportRequest,
  usePutComplaint,
};
