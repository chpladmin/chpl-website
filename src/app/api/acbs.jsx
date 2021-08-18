import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAcbs = (editable = false) => {
  const axios = useAxios();
  return useQuery('acbs', async () => {
    const response = await axios.get(`/rest/acbs?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  });
}

export { useFetchAcbs };
