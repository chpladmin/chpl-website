import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAttestations = ({
  developer,
}) => {
  const axios = useAxios();
  return useQuery([`developer/${developer.developerId}/attestations`], async () => {
    const response = await axios.get(`/developers/${developer.developerId}/attestations`);
    return response.data.developerAttestations;
  }, { keepPreviousData: true });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAttestations };
