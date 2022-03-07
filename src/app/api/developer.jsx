import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({ developer }) => {
  const axios = useAxios();
  return useQuery([`developer/${developer.developerId}/attestations`], async () => {
    const response = await axios.get(`/developers/${developer.developerId}/attestations`);
    return response.data.developerAttestations;
  }, { keepPreviousData: true });
};

const useFetchDevelopers = () => {
  const axios = useAxios();
  return useQuery(['developers'], async () => {
    const response = await axios.get('/developers');
    return response.data.developers;
  }, { keepPreviousData: true });
};

export { useFetchAttestations, useFetchDevelopers };
