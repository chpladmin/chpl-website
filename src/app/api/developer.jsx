import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer }) => {
  const axios = useAxios();
  return useQuery([`developer/${developer.developerId}/attestations`], async () => {
    const response = await axios.get(`/developers/${developer.developerId}/attestations`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchPublicAttestations = ({ developer }) => {
  const axios = useAxios();
  return useQuery([`developer/${developer.developerId}/public-attestations`], async () => {
    const response = await axios.get(`/developers/${developer.developerId}/public-attestations`);
    return response.data.developerAttestations;
  }, { keepPreviousData: true });
};

export { useFetchAttestations, useFetchPublicAttestations };
