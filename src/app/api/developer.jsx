import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer, isAuthenticated }) => {
  const axios = useAxios();
  return useQuery([`developers/${developer.id}/attestations`], async () => {
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

const usePostAttestationException = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post(`developers/${data.developer.id}/attestations/${data.period.id}/exception`)
    .then((response) => response), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => /developers\/.*attestations/.test(query.queryKey[0]),
      });
    },
  });
};

export { useFetchAttestations, useFetchDevelopers, usePostAttestationException };
