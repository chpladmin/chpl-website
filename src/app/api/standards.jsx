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

const useDeleteFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`functionalities-tested/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
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

const useDeleteTestTool = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`test-tools/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['test-tools']);
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

const useDeleteUcdProcess = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`ucd-processes/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
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

const useFetchCriteriaForFunctionalitiesTested = () => {
  const axios = useAxios();
  return useQuery(['functionalities-tested/criteria'], async () => {
    const response = await axios.get('functionalities-tested/criteria');
    return response.data;
  });
};

const useFetchCriteriaForSvaps = () => {
  const axios = useAxios();
  return useQuery(['svaps/criteria'], async () => {
    const response = await axios.get('svaps/criteria');
    return response.data;
  });
};

const useFetchCriteriaForTestTools = () => {
  const axios = useAxios();
  return useQuery(['test-tools/criteria'], async () => {
    const response = await axios.get('test-tools/criteria');
    return response.data;
  });
};

const useFetchFunctionalitiesTested = () => {
  const axios = useAxios();
  return useQuery(['functionalities-tested'], async () => {
    const response = await axios.get('functionalities-tested');
    return response.data;
  });
};

const useFetchQmsStandards = () => {
  const axios = useAxios();
  return useQuery(['qms-standards'], async () => {
    const response = await axios.get('qms-standards');
    return response.data;
  });
};

const useFetchRules = () => {
  const axios = useAxios();
  return useQuery(['rules'], async () => {
    const response = await axios.get('rules');
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

const useFetchTestTools = () => {
  const axios = useAxios();
  return useQuery(['test-tools'], async () => {
    const response = await axios.get('test-tools');
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

const usePostAccessibilityStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('accessibility-standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['accessibility-standards']);
    },
  });
};

const usePostFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('functionalities-tested', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
    },
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

const usePostTestTool = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('test-tools', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['test-tools']);
    },
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

const usePostUcdProcess = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('ucd-processes', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['ucd-processes']);
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

const usePutFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('functionalities-tested', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
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

const usePutTestTool = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('test-tools', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['test-tools']);
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
  useDeleteFunctionalityTested,
  useDeleteQmsStandard,
  useDeleteSvap,
  useDeleteTestTool,
  useDeleteUcdProcess,
  useFetchAccessibilityStandards,
  useFetchCriteriaForFunctionalitiesTested,
  useFetchCriteriaForSvaps,
  useFetchCriteriaForTestTools,
  useFetchFunctionalitiesTested,
  useFetchQmsStandards,
  useFetchRules,
  useFetchSvaps,
  useFetchTestTools,
  useFetchUcdProcesses,
  usePostAccessibilityStandard,
  usePostFunctionalityTested,
  usePostQmsStandard,
  usePostSvap,
  usePostTestTool,
  usePostUcdProcess,
  usePutAccessibilityStandard,
  usePutFunctionalityTested,
  usePutQmsStandard,
  usePutSvap,
  usePutTestTool,
  usePutUcdProcess,
};
