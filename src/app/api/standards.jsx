import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useDeleteAccessibilityStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`accessibility-standards/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['accessibility-standards']);
    },
  });
};

const useFetchAccessibilityStandards = () => {
  const axios = useAxios();
  return useQuery(['accessibility-standards'], async () => {
    const response = await axios.get('accessibility-standards');
    return response.data;
  });
};

const usePostAccessibilityStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('accessibility-standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['accessibility-standards']);
    },
  });
};

const usePutAccessibilityStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('accessibility-standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['accessibility-standards']);
    },
  });
};

const useDeleteQmsStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`qms-standards/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['qms-standards']);
    },
  });
};

const useFetchQmsStandards = () => {
  const axios = useAxios();
  return useQuery(['qms-standards'], async () => {
    const response = await axios.get('qms-standards');
    return response.data;
  });
};

const usePostQmsStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('qms-standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['qms-standards']);
    },
  });
};

const usePutQmsStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('qms-standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['qms-standards']);
    },
  });
};

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
  return useMutation(async (data) => axios.delete(`ucd-processes/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
    },
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
  useDeleteAccessibilityStandard,
  useFetchAccessibilityStandards,
  usePostAccessibilityStandard,
  usePutAccessibilityStandard,
  useDeleteQmsStandard,
  useFetchQmsStandards,
  usePostQmsStandard,
  usePutQmsStandard,
  useDeleteSvap,
  useFetchCriteriaForSvaps,
  useFetchSvaps,
  usePostSvap,
  usePutSvap,
  useDeleteUcdProcess,
  useFetchUcdProcesses,
  usePostUcdProcess,
  usePutUcdProcess,
};
