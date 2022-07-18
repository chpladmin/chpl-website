import { useMutation, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`complaints/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints');
    },
  });
};

const usePostComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('complaints', data), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints');
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
      queryClient.invalidateQueries('complaints');
    },
  });
};

export {
  useDeleteComplaint,
  usePostComplaint,
  usePostReportRequest,
  usePutComplaint,
};
