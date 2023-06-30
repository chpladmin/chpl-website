import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchAttestationForm = ({ period, developer }) => {
  const axios = useAxios();
  return useQuery(['attestations/form', period.id, developer.id], async () => {
    const response = await axios.get(`/attestations/periods/${period.id}/form?developerId=${developer.id}`);
    return response.data;
  }, {
    ...options.daily,
    enabled: !!period?.id,
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAttestationForm };
