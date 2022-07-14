import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useDeleteComplaint = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`complaints/${data.id}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('complaints');
    },
  });
};

const useFetchComplaintsDownload = ({ isAuthenticated, isDownloading }) => {
  const axios = useAxios();
  return useQuery(['complaints/download-all'], async () => {
    const response = await axios.get('complaints/download-all');
    return response.data;
  }, {
    ...options.oneTime,
    enabled: isAuthenticated && isDownloading,
  });
};

export {
  useDeleteComplaint,
  useFetchComplaintsDownload,
};
