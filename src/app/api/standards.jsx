import * as jsJoda from '@js-joda/core';
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

const useDeleteConformanceMethod = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`conformance-methods/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['conformance-methods']);
      queryClient.invalidateQueries(['activity/metadata/conformance-methods']);
    },
  });
};

const useDeleteFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`functionalities-tested/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
      queryClient.invalidateQueries(['activity/metadata/functionalities-tested']);
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

const useDeleteStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.delete(`standards/${data.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['standards']);
      queryClient.invalidateQueries(['activity/metadata/standards']);
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
      queryClient.invalidateQueries(['activity/metadata/svaps']);
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

const useFetchCodeSets = () => {
  const axios = useAxios();
  return useQuery(['code-sets'], async () => {
    const response = await axios.get('code-sets');
    return response.data;
  });
};

const useFetchConformanceMethods = () => {
  const axios = useAxios();
  return useQuery(['conformance-methods'], async () => {
    const response = await axios.get('conformance-methods');
    return response.data;
  });
};

const useFetchCqms = () => {
  const axios = useAxios();
  return useQuery(['cqms'], async () => {
    const response = await axios.get('cqms');
    return response.data;
  });
};

const useFetchCriteria = (props = { enabled: true, active: true }) => {
  const params = Object
    .entries(props)
    .filter(([key, value]) => key !== 'enabled' && key !== 'active' && value)
    .filter(([key]) => (key !== 'enabled' && key !== 'active'))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  let query = 'certification-criteria';
  if (params.length > 0) { query += `?${params}`; }
  const axios = useAxios();
  return useQuery(['certification-criteria', params], async () => {
    const response = await axios.get(query);
    return response.data.filter((cc) => !props.active || cc.startDay < jsJoda.LocalDate.now());
  }, {
    enabled: props.enabled,
  });
};

const useFetchCriteriaForConformanceMethods = () => {
  const axios = useAxios();
  return useQuery(['conformance-methods/criteria'], async () => {
    const response = await axios.get('conformance-methods/criteria');
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

const useFetchCriteriaForStandards = () => {
  const axios = useAxios();
  return useQuery(['standards/criteria'], async () => {
    const response = await axios.get('standards/criteria');
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

const useFetchG1g2 = () => {
  const axios = useAxios();
  return useQuery(['g1g2'], async () => {
    const response = await axios.get('measures');
    return response.data;
  });
};

const useFetchOptionalStandards = () => {
  const axios = useAxios();
  return useQuery(['optional-standards'], async () => {
    const response = await axios.get('optional-standards');
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

const useFetchStandards = () => {
  const axios = useAxios();
  return useQuery(['standards'], async () => {
    const response = await axios.get('standards');
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

const useFetchTestData = () => {
  const axios = useAxios();
  return useQuery(['test-data'], async () => {
    const response = await axios.get('test-data');
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

const usePostConformanceMethod = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('conformance-methods', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['conformance-methods']);
      queryClient.invalidateQueries(['activity/metadata/conformance-methods']);
    },
  });
};

const usePostFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('functionalities-tested', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
      queryClient.invalidateQueries(['activity/metadata/functionalities-tested']);
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

const usePostStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['standards']);
      queryClient.invalidateQueries(['activity/metadata/standards']);
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
      queryClient.invalidateQueries(['activity/metadata/svaps']);
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

const usePutConformanceMethod = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('conformance-methods', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['conformance-methods']);
      queryClient.invalidateQueries(['activity/metadata/conformance-methods']);
    },
  });
};

const usePutFunctionalityTested = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('functionalities-tested', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['functionalities-tested']);
      queryClient.invalidateQueries(['activity/metadata/functionalities-tested']);
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

const usePutStandard = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('standards', data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['standards']);
      queryClient.invalidateQueries(['activity/metadata/standards']);
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
      queryClient.invalidateQueries(['activity/metadata/svaps']);
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
  useDeleteConformanceMethod,
  useDeleteFunctionalityTested,
  useDeleteQmsStandard,
  useDeleteStandard,
  useDeleteSvap,
  useDeleteTestTool,
  useDeleteUcdProcess,
  useFetchAccessibilityStandards,
  useFetchCodeSets,
  useFetchConformanceMethods,
  useFetchCqms,
  useFetchCriteria,
  useFetchCriteriaForConformanceMethods,
  useFetchCriteriaForFunctionalitiesTested,
  useFetchCriteriaForStandards,
  useFetchCriteriaForSvaps,
  useFetchCriteriaForTestTools,
  useFetchFunctionalitiesTested,
  useFetchG1g2,
  useFetchOptionalStandards,
  useFetchQmsStandards,
  useFetchRules,
  useFetchStandards,
  useFetchSvaps,
  useFetchTestData,
  useFetchTestTools,
  useFetchUcdProcesses,
  usePostAccessibilityStandard,
  usePostConformanceMethod,
  usePostFunctionalityTested,
  usePostQmsStandard,
  usePostStandard,
  usePostSvap,
  usePostTestTool,
  usePostUcdProcess,
  usePutAccessibilityStandard,
  usePutConformanceMethod,
  usePutFunctionalityTested,
  usePutQmsStandard,
  usePutStandard,
  usePutSvap,
  usePutTestTool,
  usePutUcdProcess,
};
