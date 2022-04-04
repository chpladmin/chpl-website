import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`jobs/${data.id}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });
};

const useFetchJobTypes = () => {
  const axios = useAxios();
  return useQuery(['schedules/jobs'], async () => {
    const response = await axios.get('schedules/jobs', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const useFetchSystemJobs = () => {
  const axios = useAxios();
  return useQuery(['schedules/triggers', 'system'], async () => {
    const response = await axios.get('schedules/triggers?jobType=system', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const useFetchUserJobs = () => {
  const axios = useAxios();
  return useQuery(['schedules/triggers'], async () => {
    const response = await axios.get('schedules/triggers', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  });
};

const usePostJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('jobs', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });
};

const usePutJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`jobs/${data.id}`, data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
    },
  });
};

export {
  useDeleteJob,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePutJob,
};
