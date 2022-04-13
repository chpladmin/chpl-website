import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteTrigger = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`/schedules/triggers/${data.group}/${data.name}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules/triggers']);
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

const useFetchSystemJobs = ({ isAuthenticated }) => {
  const axios = useAxios();
  return useQuery(['schedules/triggers', 'system'], async () => {
    const response = await axios.get('schedules/triggers?jobType=system', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data.results;
  }, {
    enabled: isAuthenticated,
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
  return useMutation(async (data) => axios.post('schedules/triggers', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules/triggers']);
    },
  });
};

const usePostOneTimeJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('schedules/triggers/one_time', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules/triggers', 'system']);
    },
  });
};

const usePutJob = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('schedules/jobs', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules/jobs');
    },
  });
};

const usePutTrigger = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('schedules/triggers', data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules/triggers');
    },
  });
};

export {
  useDeleteTrigger,
  useFetchJobTypes,
  useFetchSystemJobs,
  useFetchUserJobs,
  usePostJob,
  usePostOneTimeJob,
  usePutJob,
  usePutTrigger,
};
