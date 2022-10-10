import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteSvap = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`svaps/${data.svapId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['svaps']);
    },
  });
};

const useFetchCriteriaForSvaps = () => {
  const axios = useAxios();
  return useQuery(['svaps/criteria'], async () => {
    const response = await axios.get('svaps/criteria');
    return response.data;
  });
};

const useFetchSvaps = () => {
  const axios = useAxios();
  return useQuery(['svaps'], async () => {
    const response = await axios.get('svaps');
    return response.data;
  });
};

const usePostSvap = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('svaps', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['svaps']);
    },
  });
};

const usePutSvap = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('svaps', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['svaps']);
    },
  });
};

const useDeleteUcdProcess = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`ucd-processes/${data.ucdProcessId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
    },
  });
};

const useFetchCriteriaForUcdProcesses = () => {
  const axios = useAxios();
  return useQuery(['ucd-processes/criteria'], async () => {
    const response = await axios.get('ucd-processes/criteria');
    return response.data;
  });
};

const useFetchUcdProcesses = () => {
  const axios = useAxios();
  return useQuery(['ucd-processes'], async () => {
    const response = await axios.get('ucd-processes');
    return response.data;
  });
};

const usePostUcdProcess = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('ucd-processes', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
    },
  });
};

const usePutUcdProcess = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('ucd-processes', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
    },
  });
};

export {
  useDeleteSvap,
  useFetchCriteriaForSvaps,
  useFetchSvaps,
  usePostSvap,
  usePutSvap,
  useDeleteUcdProcess,
  useFetchCriteriaForUcdProcesses,
  useFetchUcdProcesses,
  usePostUcdProcess,
  usePutUcdProcess,
};
