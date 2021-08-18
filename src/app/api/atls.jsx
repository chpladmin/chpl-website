import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAtls = (editable = false) => {
  const axios = useAxios();
  return useQuery('atls', async () => {
    const response = await axios.get(`/rest/atls?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  });
}

export { useFetchAtls };
