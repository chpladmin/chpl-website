import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer, isAuthenticated }) => {
  const axios = useAxios();
  return useQuery([`developer/${developer.developerId}/attestations`], async () => {
    const response = await axios.get(`/developers/${developer.developerId}/attestations`);
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

const usePostAttestationException = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`developers/${data.developer.developerId}/attestations/exception`)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
      });
    },
  });
};

export { useFetchAttestations, useFetchDevelopers, usePostAttestationException };
