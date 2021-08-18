import { useQuery } from 'react-query';

import { useAxios } from './axios';

const useFetchAtls = (editable = false) => {
  const axios = useAxios();
  return useQuery('atls', async () => {
    const response = await axios.get(`/rest/atls?editable=${editable ? 'true' : 'false'}`);
    return response.data;
  });
};

/* eslint-disable import/prefer-default-export */
// remove eslint disable line when new api methods are added
export { useFetchAtls };
