import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchAnnouncements = ({ getFuture }) => {
  const axios = useAxios();
  return useQuery(['announcements', getFuture], async () => {
    const response = await axios.get(`announcements?future=${getFuture}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.announcements;
  });
};

const useDeleteAnnouncement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`announcements/${data.id}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('announcements');
    },
  });
};

const usePostAnnouncement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('announcements', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('announcements');
    },
  });
};

const usePutAnnouncement = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`announcements/${data.id}`, data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('announcements');
    },
  });
};

export {
  useFetchAnnouncements,
  useDeleteAnnouncement,
  usePostAnnouncement,
  usePutAnnouncement,
};
