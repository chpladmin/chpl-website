import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer, isAuthenticated }) => {
  const axios = useAxios();
  return useQuery(['developers/attestations', developer.id], async () => {
    const response = await axios.get(`/developers/${developer.id}/attestations`);
    return response.data;
  }, {
    enabled: isAuthenticated && !!developer?.id,
  });
};

const useFetchDeveloperHierarchy = ({ id }) => {
  const axios = useAxios();
  return useQuery(['developers/hierarchy', id], async () => {
    const response = await axios.get(`/developers/${id}/hierarchy`);
    return response.data;
  }, {
    enabled: !!id,
  });
};

const useFetchDevelopers = () => {
  const axios = useAxios();
  return useQuery(['developers'], async () => {
    const response = await axios.get('/developers');
    return response.data.developers;
  }, { keepPreviousData: true });
};

const useFetchDevelopersBySearch = ({
  orderBy = 'developer',
  pageNumber = 0,
  pageSize = 25,
  sortDescending = false,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['developers/search/v3', {
    orderBy, pageNumber, pageSize, sortDescending, query,
  }], async () => {
    const response = await axios.get(`/developers/search/v3?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchDirectReviews = ({ developer }) => {
  const axios = useAxios();
  return useQuery(['developers/direct-reviews', developer?.id], async () => {
    const response = await axios.get(`/developers/${developer.id}/direct-reviews`);
    return response.data;
  }, {
    enabled: !!developer,
  });
};

const useFetchRealWorldTestingPlans = ({ developer }) => {
  const axios = useAxios();
  return useQuery(['developers/rwt-plans-urls', developer?.id], async () => {
    const response = await axios.get(`/developers/${developer.id}/rwt-plans-urls`);
    return response.data;
  }, {
    enabled: !!developer,
  });
};

const useFetchRealWorldTestingResults = ({ developer }) => {
  const axios = useAxios();
  return useQuery(['developers/rwt-results-urls', developer?.id], async () => {
    const response = await axios.get(`/developers/${developer.id}/rwt-results-urls`);
    return response.data;
  }, {
    enabled: !!developer,
  });
};

const useFetchUsersAtDeveloper = (developer, includeDisabled = false) => {
  const id = developer?.id;
  const axios = useAxios();
  return useQuery(['developers', 'users', id, includeDisabled], async () => {
    const response = await axios.get(`developers/${id}/users?includeDisabled=${includeDisabled ? 'true' : 'false'}`);
    return response.data;
  }, {
    enabled: !!id,
  });
};

const usePostAttestationException = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`developers/${data.developer.id}/attestations/${data.period.id}/exception`)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers/attestations');
    },
  });
};

const usePutDeveloper = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`developers/${data.id}`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/hierarchy');
    },
  });
};

const usePutJoinDevelopers = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put(`developers/${data.developer.id}/join`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

const usePostDeveloperSplit = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`developers/${data.oldDeveloper.id}/split`, data)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries('developers');
      queryClient.invalidateQueries('developers/search/v3');
    },
  });
};

const usePostMessage = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('developers/messages', data)
    .then((response) => response));
};

const usePostMessagePreview = () => {
  const axios = useAxios();
  return useMutation(async (data) => axios.post('developers/message-preview', data)
    .then((response) => response));
};

export {
  useFetchAttestations,
  useFetchDeveloperHierarchy,
  useFetchDevelopers,
  useFetchDevelopersBySearch,
  useFetchDirectReviews,
  useFetchRealWorldTestingPlans,
  useFetchRealWorldTestingResults,
  useFetchUsersAtDeveloper,
  usePostAttestationException,
  usePutDeveloper,
  usePutJoinDevelopers,
  usePostDeveloperSplit,
  usePostMessage,
  usePostMessagePreview,
};
