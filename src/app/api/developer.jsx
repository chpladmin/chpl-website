import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer, isAuthenticated }) => {
  const axios = useAxios();
  return useQuery(['developers/attestations', developer.id], async () => {
    const response = await axios.get(`/developers/${developer.id}/attestations`);
    return response.data;
  }, {
    enabled: isAuthenticated,
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
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
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
  useFetchDevelopers,
  useFetchDevelopersBySearch,
  useFetchRealWorldTestingPlans,
  useFetchRealWorldTestingResults,
  usePostAttestationException,
  usePutDeveloper,
  usePutJoinDevelopers,
  usePostMessage,
  usePostMessagePreview,
};
